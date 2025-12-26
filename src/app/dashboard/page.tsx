"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { Target, Flame, TrendingUp, CheckCircle2, Plus, ArrowRight, Sparkles, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const weeklyChartConfig = {
    rate: {
        label: "Completion Rate",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const monthlyChartConfig = {
    completed: {
        label: "Completed",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export default function DashboardHome() {
    const { user, isLoaded } = useUser();
    const clerkId = user?.id || "";

    const stats = useQuery(
        api.analytics.getStats,
        clerkId ? { clerkId } : "skip"
    );
    const weeklyTrend = useQuery(
        api.analytics.getWeeklyTrend,
        clerkId ? { clerkId } : "skip"
    );
    const monthlyTrend = useQuery(
        api.analytics.getMonthlyTrend,
        clerkId ? { clerkId } : "skip"
    );
    const categoryBreakdown = useQuery(
        api.analytics.getCategoryBreakdown,
        clerkId ? { clerkId } : "skip"
    );
    const habits = useQuery(
        api.habits.getHabitsWithTodayStatus,
        clerkId ? { clerkId } : "skip"
    );

    if (!isLoaded) {
        return <DashboardSkeleton />;
    }

    const todayProgress = stats?.activeHabits
        ? Math.round((stats.completedToday / stats.activeHabits) * 100)
        : 0;

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
            {/* Welcome Header with Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Welcome back, {user?.firstName || "there"}! 👋
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Here&apos;s your habit progress overview
                    </p>
                </div>
                <Link href="/dashboard/habits">
                    <Button className="w-full sm:w-auto bg-white text-zinc-900 hover:bg-zinc-100 font-semibold">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Habit
                    </Button>
                </Link>
            </div>

            {/* Today's Progress Card */}
            <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-indigo-500/5">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-5 w-5 text-violet-500" />
                                <span className="text-sm font-medium text-muted-foreground">Today&apos;s Progress</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl sm:text-4xl font-bold">{stats?.completedToday ?? 0}</span>
                                <span className="text-muted-foreground">of {stats?.activeHabits ?? 0} habits</span>
                            </div>
                            <Progress value={todayProgress} className="mt-3 h-2" />
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                    <span className="text-2xl font-bold">{stats?.currentStreak ?? 0}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Day Streak</span>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                    <span className="text-2xl font-bold">{stats?.completionRate ?? 0}%</span>
                                </div>
                                <span className="text-xs text-muted-foreground">This Week</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards - 2x2 on mobile, 4 cols on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Active Habits</CardTitle>
                        <Target className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                        <div className="text-xl sm:text-2xl font-bold">{stats?.activeHabits ?? 0}</div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                            {stats?.completedToday ?? 0} done today
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Completion</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                        <div className="text-xl sm:text-2xl font-bold">{stats?.completionRate ?? 0}%</div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Last 7 days</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Current Streak</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                        <div className="text-xl sm:text-2xl font-bold">{stats?.currentStreak ?? 0}</div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Days in a row</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6 sm:pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Best Streak</CardTitle>
                        <TrendingUp className="h-4 w-4 text-cyan-500" />
                    </CardHeader>
                    <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                        <div className="text-xl sm:text-2xl font-bold">{stats?.bestStreak ?? 0}</div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Personal best</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Habits Section - Show on mobile */}
            {habits && habits.filter(h => h.active).length > 0 && (
                <Card>
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base sm:text-lg">Today&apos;s Habits</CardTitle>
                            <Link href="/dashboard/habits">
                                <Button variant="ghost" size="sm" className="text-xs">
                                    View All <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                        <div className="space-y-2">
                            {habits.filter(h => h.active).slice(0, 5).map((habit) => (
                                <div
                                    key={habit._id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div
                                        className={`h-8 w-8 rounded-full flex items-center justify-center ${habit.todayCompleted
                                            ? "bg-emerald-500/20 text-emerald-500"
                                            : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {habit.todayCompleted ? (
                                            <CheckCircle2 className="h-4 w-4" />
                                        ) : (
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: habit.color }}
                                            />
                                        )}
                                    </div>
                                    <span className={`flex-1 text-sm ${habit.todayCompleted ? "line-through text-muted-foreground" : ""}`}>
                                        {habit.title}
                                    </span>
                                    {habit.category && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground hidden sm:inline">
                                            {habit.category}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Charts - Stack on mobile */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Weekly Trend */}
                <Card>
                    <CardHeader className="p-4 sm:p-6 pb-2">
                        <CardTitle className="text-base sm:text-lg">Weekly Trend</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Completion rate over 7 days</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-6 pt-0">
                        {weeklyTrend && weeklyTrend.length > 0 ? (
                            <ChartContainer config={weeklyChartConfig} className="h-[180px] sm:h-[200px] w-full">
                                <AreaChart data={weeklyTrend}>
                                    <defs>
                                        <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                            <stop offset="50%" stopColor="#A855F7" stopOpacity={0.5} />
                                            <stop offset="100%" stopColor="#D946EF" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="weeklyStroke" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#8B5CF6" />
                                            <stop offset="100%" stopColor="#D946EF" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis dataKey="dayName" className="text-[10px] sm:text-xs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                                    <YAxis className="text-[10px] sm:text-xs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={30} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="url(#weeklyStroke)"
                                        fill="url(#weeklyGradient)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex h-[180px] sm:h-[200px] items-center justify-center text-muted-foreground text-sm">
                                No data yet. Start tracking!
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Monthly Trend */}
                <Card>
                    <CardHeader className="p-4 sm:p-6 pb-2">
                        <CardTitle className="text-base sm:text-lg">Monthly Trend</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Habits completed over 30 days</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-6 pt-0">
                        {monthlyTrend && monthlyTrend.length > 0 ? (
                            <ChartContainer config={monthlyChartConfig} className="h-[180px] sm:h-[200px] w-full">
                                <BarChart data={monthlyTrend}>
                                    <defs>
                                        <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#06B6D4" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#10B981" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis dataKey="day" className="text-[10px] sm:text-xs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} interval={4} />
                                    <YAxis className="text-[10px] sm:text-xs" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} width={30} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="completed" fill="url(#monthlyGradient)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex h-[180px] sm:h-[200px] items-center justify-center text-muted-foreground text-sm">
                                No data yet. Start tracking!
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Category Breakdown - Responsive layout */}
            <Card>
                <CardHeader className="p-4 sm:p-6 pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base sm:text-lg">Habits by Category</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Distribution of your habits</CardDescription>
                        </div>
                        <Link href="/dashboard/insights">
                            <Button variant="ghost" size="sm" className="text-xs">
                                More Insights <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                    {categoryBreakdown && categoryBreakdown.length > 0 ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                            <ChartContainer
                                config={{
                                    count: { label: "Habits" },
                                }}
                                className="h-[200px] sm:h-[250px] w-full max-w-[250px] sm:max-w-[300px]"
                            >
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Pie
                                        data={categoryBreakdown}
                                        dataKey="count"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                    >
                                        {categoryBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                            <div className="flex flex-wrap justify-center sm:flex-col gap-2 sm:gap-3">
                                {categoryBreakdown.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="h-3 w-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: item.fill }}
                                        />
                                        <span className="text-xs sm:text-sm whitespace-nowrap">
                                            {item.category}: {item.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
                            <div className="text-center">
                                <Calendar className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                                <p>No habits yet.</p>
                                <Link href="/dashboard/habits">
                                    <Button variant="link" size="sm">Create your first habit</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48 sm:w-64" />
                    <Skeleton className="h-4 w-32 sm:w-48 mt-2" />
                </div>
                <Skeleton className="h-10 w-full sm:w-32" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2 p-3 sm:p-6 sm:pb-2">
                            <Skeleton className="h-4 w-16 sm:w-24" />
                        </CardHeader>
                        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                            <Skeleton className="h-6 sm:h-8 w-12 sm:w-16" />
                            <Skeleton className="h-3 sm:h-4 w-20 sm:w-32 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
