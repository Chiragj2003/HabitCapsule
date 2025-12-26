import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const toggleEntry = mutation({
    args: {
        clerkId: v.string(),
        habitId: v.id("habits"),
        entryDate: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        const existing = await ctx.db
            .query("habitEntries")
            .withIndex("by_habit_date", (q) =>
                q.eq("habitId", args.habitId).eq("entryDate", args.entryDate)
            )
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                completed: !existing.completed,
                updatedAt: Date.now(),
            });
            return { entryId: existing._id, completed: !existing.completed };
        }

        const entryId = await ctx.db.insert("habitEntries", {
            habitId: args.habitId,
            userId: user._id,
            clerkId: args.clerkId,
            entryDate: args.entryDate,
            completed: true,
            value: undefined,
            notes: undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return { entryId, completed: true };
    },
});

export const logEntry = mutation({
    args: {
        clerkId: v.string(),
        habitId: v.id("habits"),
        entryDate: v.string(),
        value: v.optional(v.number()),
        notes: v.optional(v.string()),
        completed: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        const existing = await ctx.db
            .query("habitEntries")
            .withIndex("by_habit_date", (q) =>
                q.eq("habitId", args.habitId).eq("entryDate", args.entryDate)
            )
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                value: args.value,
                notes: args.notes,
                completed: args.completed ?? existing.completed,
                updatedAt: Date.now(),
            });
            return existing._id;
        }

        const entryId = await ctx.db.insert("habitEntries", {
            habitId: args.habitId,
            userId: user._id,
            clerkId: args.clerkId,
            entryDate: args.entryDate,
            completed: args.completed ?? false,
            value: args.value,
            notes: args.notes,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return entryId;
    },
});

export const getEntriesForDate = query({
    args: {
        clerkId: v.string(),
        entryDate: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("habitEntries")
            .withIndex("by_clerk_date", (q) =>
                q.eq("clerkId", args.clerkId).eq("entryDate", args.entryDate)
            )
            .collect();
    },
});

export const getEntriesInRange = query({
    args: {
        clerkId: v.string(),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const entries = await ctx.db
            .query("habitEntries")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .collect();

        return entries.filter(
            (e) => e.entryDate >= args.startDate && e.entryDate <= args.endDate
        );
    },
});

export const getEntriesForHabit = query({
    args: {
        habitId: v.id("habits"),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let entries = await ctx.db
            .query("habitEntries")
            .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
            .collect();

        if (args.startDate && args.endDate) {
            entries = entries.filter(
                (e) => e.entryDate >= args.startDate! && e.entryDate <= args.endDate!
            );
        }

        return entries;
    },
});

// Cleanup mutation: Mark today's entries as incomplete for inactive habits
export const cleanupInactiveHabitEntries = mutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        // Get all inactive habits for this user
        const allHabits = await ctx.db
            .query("habits")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        const inactiveHabits = allHabits.filter((h) => !h.active);
        const inactiveHabitIds = new Set(inactiveHabits.map((h) => h._id));

        // Get today's date
        const today = new Date().toISOString().split("T")[0];

        // Get today's entries
        const todayEntries = await ctx.db
            .query("habitEntries")
            .withIndex("by_clerk_date", (q) =>
                q.eq("clerkId", args.clerkId).eq("entryDate", today)
            )
            .collect();

        // Mark entries for inactive habits as incomplete
        let fixedCount = 0;
        for (const entry of todayEntries) {
            if (inactiveHabitIds.has(entry.habitId) && entry.completed) {
                await ctx.db.patch(entry._id, {
                    completed: false,
                    updatedAt: Date.now(),
                });
                fixedCount++;
            }
        }

        return { fixedCount };
    },
});
