import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createHabit = mutation({
    args: {
        clerkId: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        color: v.optional(v.string()),
        goalType: v.union(
            v.literal("binary"),
            v.literal("duration"),
            v.literal("quantity")
        ),
        goalTarget: v.optional(v.number()),
        unit: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        const habitId = await ctx.db.insert("habits", {
            userId: user._id,
            clerkId: args.clerkId,
            title: args.title,
            description: args.description,
            category: args.category,
            color: args.color || "#FFB4A2",
            goalType: args.goalType,
            goalTarget: args.goalTarget,
            unit: args.unit,
            active: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return habitId;
    },
});

export const updateHabit = mutation({
    args: {
        habitId: v.id("habits"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        color: v.optional(v.string()),
        goalType: v.optional(
            v.union(
                v.literal("binary"),
                v.literal("duration"),
                v.literal("quantity")
            )
        ),
        goalTarget: v.optional(v.number()),
        unit: v.optional(v.string()),
        active: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { habitId, ...updates } = args;

        const habit = await ctx.db.get(habitId);
        if (!habit) throw new Error("Habit not found");

        await ctx.db.patch(habitId, {
            ...updates,
            updatedAt: Date.now(),
        });

        return habitId;
    },
});

export const deleteHabit = mutation({
    args: { habitId: v.id("habits") },
    handler: async (ctx, args) => {
        // Delete all entries for this habit
        const entries = await ctx.db
            .query("habitEntries")
            .withIndex("by_habit", (q) => q.eq("habitId", args.habitId))
            .collect();

        for (const entry of entries) {
            await ctx.db.delete(entry._id);
        }

        // Delete the habit
        await ctx.db.delete(args.habitId);

        return true;
    },
});

export const getHabits = query({
    args: {
        clerkId: v.string(),
        activeOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) return [];

        let habits;
        if (args.activeOnly) {
            habits = await ctx.db
                .query("habits")
                .withIndex("by_user_active", (q) =>
                    q.eq("userId", user._id).eq("active", true)
                )
                .collect();
        } else {
            habits = await ctx.db
                .query("habits")
                .withIndex("by_user", (q) => q.eq("userId", user._id))
                .collect();
        }

        return habits;
    },
});

export const getHabitById = query({
    args: { habitId: v.id("habits") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.habitId);
    },
});

export const getHabitsWithTodayStatus = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) return [];

        // Get ALL habits (both active and inactive) for proper frontend filtering
        const habits = await ctx.db
            .query("habits")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        const today = new Date().toISOString().split("T")[0];

        const habitsWithStatus = await Promise.all(
            habits.map(async (habit) => {
                const entry = await ctx.db
                    .query("habitEntries")
                    .withIndex("by_habit_date", (q) =>
                        q.eq("habitId", habit._id).eq("entryDate", today)
                    )
                    .first();

                return {
                    ...habit,
                    todayCompleted: entry?.completed ?? false,
                    todayValue: entry?.value ?? 0,
                    todayEntryId: entry?._id,
                };
            })
        );

        return habitsWithStatus;
    },
});
