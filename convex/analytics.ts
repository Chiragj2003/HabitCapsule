import { v } from "convex/values";
import { query } from "./_generated/server";

export const getStats = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .first();

        if (!user) {
            return {
                activeHabits: 0,
                completionRate: 0,
                currentStreak: 0,
                bestStreak: 0,
                completedToday: 0,
                totalToday: 0,
            };
        }

        // Get active habits
        const habits = await ctx.db
            .query("habits")
            .withIndex("by_user_active", (q) =>
                q.eq("userId", user._id).eq("active", true)
            )
            .collect();

        const activeHabits = habits.length;
        const activeHabitIds = new Set(habits.map((h) => h._id));

        // Get today's date
        const today = new Date().toISOString().split("T")[0];

        // Get today's entries
        const todayEntries = await ctx.db
            .query("habitEntries")
            .withIndex("by_clerk_date", (q) =>
                q.eq("clerkId", args.clerkId).eq("entryDate", today)
            )
            .collect();

        // Only count completions for active habits
        const completedToday = todayEntries.filter(
            (e) => e.completed && activeHabitIds.has(e.habitId)
        ).length;

        // Calculate completion rate for last 7 days
        const last7Days: string[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push(date.toISOString().split("T")[0]);
        }

        const recentEntries = await ctx.db
            .query("habitEntries")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .collect();

        // Only count entries for active habits
        const relevantEntries = recentEntries.filter(
            (e) => last7Days.includes(e.entryDate) && activeHabitIds.has(e.habitId)
        );

        const possibleCompletions = activeHabits * 7;
        const actualCompletions = relevantEntries.filter((e) => e.completed).length;
        const completionRate =
            possibleCompletions > 0
                ? Math.round((actualCompletions / possibleCompletions) * 100)
                : 0;

        // Calculate streaks
        const { currentStreak, bestStreak } = calculateStreaks(
            recentEntries,
            activeHabits
        );

        return {
            activeHabits,
            completionRate,
            currentStreak,
            bestStreak,
            completedToday,
            totalToday: activeHabits,
        };
    },
});

function calculateStreaks(
    entries: Array<{ entryDate: string; completed: boolean }>,
    habitCount: number
) {
    if (habitCount === 0) return { currentStreak: 0, bestStreak: 0 };

    // Group entries by date
    const entriesByDate = new Map<string, number>();
    entries.forEach((e) => {
        if (e.completed) {
            entriesByDate.set(e.entryDate, (entriesByDate.get(e.entryDate) || 0) + 1);
        }
    });

    // Sort dates
    const dates = Array.from(entriesByDate.keys()).sort().reverse();

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const today = new Date().toISOString().split("T")[0];
    let checkDate = new Date();

    // Calculate current streak
    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split("T")[0];
        const completions = entriesByDate.get(dateStr) || 0;

        if (completions > 0) {
            tempStreak++;
        } else if (dateStr !== today) {
            break;
        }

        checkDate.setDate(checkDate.getDate() - 1);
    }
    currentStreak = tempStreak;

    // Calculate best streak from all dates
    tempStreak = 0;
    let prevDate: Date | null = null;

    dates.forEach((dateStr) => {
        const currentDate = new Date(dateStr);

        if (prevDate) {
            const diffDays = Math.floor(
                (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (diffDays === 1) {
                tempStreak++;
            } else {
                bestStreak = Math.max(bestStreak, tempStreak);
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }

        prevDate = currentDate;
    });

    bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

    return { currentStreak, bestStreak };
}

export const getWeeklyTrend = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push({
                date: date.toISOString().split("T")[0],
                dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
            });
        }

        const entries = await ctx.db
            .query("habitEntries")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .collect();

        const habits = await ctx.db
            .query("habits")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .collect();

        const activeHabits = habits.filter((h) => h.active);
        const activeHabitIds = new Set(activeHabits.map((h) => h._id));

        return days.map(({ date, dayName }) => {
            const dayEntries = entries.filter(
                (e) => e.entryDate === date && activeHabitIds.has(e.habitId)
            );
            const completed = dayEntries.filter((e) => e.completed).length;
            const rate = activeHabits.length > 0 ? Math.round((completed / activeHabits.length) * 100) : 0;

            return {
                date,
                dayName,
                completed,
                total: activeHabits.length,
                rate,
            };
        });
    },
});

export const getMonthlyTrend = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split("T")[0]);
        }

        const entries = await ctx.db
            .query("habitEntries")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .collect();

        const habits = await ctx.db
            .query("habits")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .collect();

        const activeHabits = habits.filter((h) => h.active);
        const activeHabitIds = new Set(activeHabits.map((h) => h._id));

        return days.map((date) => {
            const dayEntries = entries.filter(
                (e) => e.entryDate === date && activeHabitIds.has(e.habitId)
            );
            const completed = dayEntries.filter((e) => e.completed).length;
            const rate = activeHabits.length > 0 ? Math.round((completed / activeHabits.length) * 100) : 0;

            return {
                date,
                day: new Date(date).getDate(),
                completed,
                total: activeHabits.length,
                rate,
            };
        });
    },
});

export const getCategoryBreakdown = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const habits = await ctx.db
            .query("habits")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .collect();

        const categoryMap = new Map<string, number>();

        habits.forEach((habit) => {
            const category = habit.category || "Uncategorized";
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });

        // Vibrant, catchy colors for pie charts
        const colors = [
            "#8B5CF6", // Violet
            "#06B6D4", // Cyan
            "#F59E0B", // Amber
            "#EC4899", // Pink
            "#10B981", // Emerald
            "#6366F1", // Indigo
            "#EF4444", // Red
            "#14B8A6", // Teal
        ];

        return Array.from(categoryMap.entries()).map(([category, count], index) => ({
            category,
            count,
            fill: colors[index % colors.length],
        }));
    },
});

export const getHabitStreaks = query({
    args: { clerkId: v.string() },
    handler: async (ctx, args) => {
        const habits = await ctx.db
            .query("habits")
            .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
            .collect();

        const activeHabits = habits.filter((h) => h.active);

        const streaksData = await Promise.all(
            activeHabits.map(async (habit) => {
                const entries = await ctx.db
                    .query("habitEntries")
                    .withIndex("by_habit", (q) => q.eq("habitId", habit._id))
                    .collect();

                const { currentStreak, bestStreak } = calculateStreaks(entries, 1);

                return {
                    habitId: habit._id,
                    title: habit.title,
                    color: habit.color,
                    currentStreak,
                    bestStreak,
                };
            })
        );

        return streaksData.sort((a, b) => b.currentStreak - a.currentStreak);
    },
});
