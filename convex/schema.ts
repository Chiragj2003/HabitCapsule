import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        clerkId: v.string(),
        email: v.optional(v.string()),
        name: v.optional(v.string()),
        timezone: v.string(),
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_clerk_id", ["clerkId"])
        .index("by_email", ["email"]),

    habits: defineTable({
        userId: v.id("users"),
        clerkId: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        color: v.string(),
        goalType: v.union(
            v.literal("binary"),
            v.literal("duration"),
            v.literal("quantity")
        ),
        goalTarget: v.optional(v.number()),
        unit: v.optional(v.string()),
        active: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_clerk_id", ["clerkId"])
        .index("by_user_active", ["userId", "active"]),

    habitEntries: defineTable({
        habitId: v.id("habits"),
        userId: v.id("users"),
        clerkId: v.string(),
        entryDate: v.string(), // ISO date string YYYY-MM-DD
        completed: v.boolean(),
        value: v.optional(v.number()),
        notes: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_habit", ["habitId"])
        .index("by_user", ["userId"])
        .index("by_clerk_id", ["clerkId"])
        .index("by_habit_date", ["habitId", "entryDate"])
        .index("by_user_date", ["userId", "entryDate"])
        .index("by_clerk_date", ["clerkId", "entryDate"]),

    badges: defineTable({
        userId: v.id("users"),
        clerkId: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        icon: v.optional(v.string()),
        metadata: v.optional(v.any()),
        awardedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_clerk_id", ["clerkId"]),
});
