import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const awardBadge = mutation({
    args: {
        clerkId: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) throw new Error("User not found");

        const badgeId = await ctx.db.insert("badges", {
            userId: user._id,
            clerkId: args.clerkId,
            name: args.name,
            description: args.description,
            icon: args.icon,
            metadata: args.metadata,
            awardedAt: Date.now(),
        });

        return badgeId;
    },
});

export const getBadges = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("badges")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .collect();
    },
});
