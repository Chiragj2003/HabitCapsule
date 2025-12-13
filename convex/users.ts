import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreateUser = mutation({
    args: {
        clerkId: v.string(),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (existing) {
            // Update user info if changed
            if (args.email !== existing.email || args.name !== existing.name) {
                await ctx.db.patch(existing._id, {
                    email: args.email,
                    name: args.name,
                    updatedAt: Date.now(),
                });
            }
            return existing._id;
        }

        const userId = await ctx.db.insert("users", {
            clerkId: args.clerkId,
            email: args.email,
            name: args.name,
            timezone: "UTC",
            isActive: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return userId;
    },
});

export const getUser = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();
    },
});

export const updateUser = mutation({
    args: {
        clerkId: v.string(),
        timezone: v.optional(v.string()),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            ...(args.timezone && { timezone: args.timezone }),
            ...(args.name && { name: args.name }),
            updatedAt: Date.now(),
        });

        return user._id;
    },
});

export const deactivateUser = mutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            isActive: false,
            updatedAt: Date.now(),
        });

        return user._id;
    },
});

export const deleteUser = mutation({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        // Delete all user's habit entries
        const entries = await ctx.db
            .query("habitEntries")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();
        for (const entry of entries) {
            await ctx.db.delete(entry._id);
        }

        // Delete all user's habits
        const habits = await ctx.db
            .query("habits")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();
        for (const habit of habits) {
            await ctx.db.delete(habit._id);
        }

        // Delete all user's badges
        const badges = await ctx.db
            .query("badges")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();
        for (const badge of badges) {
            await ctx.db.delete(badge._id);
        }

        // Delete user
        await ctx.db.delete(user._id);

        return true;
    },
});
