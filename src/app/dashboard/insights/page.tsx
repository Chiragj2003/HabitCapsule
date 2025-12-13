"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    Line,
    LineChart,
    Pie,
    PieChart,
    XAxis,
    YAxis,
} from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const chartConfig = {
    rate: { label: "Rate", color: "hsl(var(--chart-1))" },
    completed: { label: "Completed", color: "hsl(var(--chart-2))" },
    currentStreak: { label: "Current", color: "hsl(var(--chart-3))" },
    bestStreak: { label: "Best", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

export default function InsightsPage() {
    const { user } = useUser();
    const clerkId = user?.id || "";

    const stats = useQuery(api.analytics.getStats, clerkId ? { clerkId } : "skip");
    const weeklyTrend = useQuery(api.analytics.getWeeklyTrend, clerkId ? { clerkId } : "skip");
    const monthlyTrend = useQuery(api.analytics.getMonthlyTrend, clerkId ? { clerkId } : "skip");
    const categoryBreakdown = useQuery(api.analytics.getCategoryBreakdown, clerkId ? { clerkId } : "skip");
    const habitStreaks = useQuery(api.analytics.getHabitStreaks, clerkId ? { clerkId } : "skip");
    const habits = useQuery(api.habits.getHabits, clerkId ? { clerkId } : "skip");

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Insights</h1>
                <p className="text-muted-foreground">
                    Deep dive into your habit data and trends
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{habits?.length ?? 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.activeHabits ?? 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">7-Day Avg</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.completionRate ?? 0}%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.bestStreak ?? 0} days</div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Completion Rate Over Time */}
                <Card>
                    <CardHeader>
                        <CardTitle>Completion Rate Trend</CardTitle>
                        <CardDescription>Your completion rate over the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {monthlyTrend && monthlyTrend.length > 0 ? (
                            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <AreaChart data={monthlyTrend}>
                                    <defs>
                                        <linearGradient id="insightsRateGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.8} />
                                            <stop offset="50%" stopColor="#FB7185" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="#FDA4AF" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="insightsRateStroke" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#F43F5E" />
                                            <stop offset="100%" stopColor="#F97316" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis className="text-xs" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="url(#insightsRateStroke)"
                                        fill="url(#insightsRateGradient)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        ) : (
                            <EmptyState message="No data yet" />
                        )}
                    </CardContent>
                </Card>

                {/* Weekly Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Performance</CardTitle>
                        <CardDescription>Habits completed each day this week</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {weeklyTrend && weeklyTrend.length > 0 ? (
                            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <BarChart data={weeklyTrend}>
                                    <defs>
                                        <linearGradient id="insightsWeeklyGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#06B6D4" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#10B981" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis dataKey="dayName" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="completed" fill="url(#insightsWeeklyGradient)" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <EmptyState message="No data yet" />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Streaks and Categories */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Habit Streaks */}
                <Card>
                    <CardHeader>
                        <CardTitle>Habit Streaks</CardTitle>
                        <CardDescription>Current and best streaks for each habit</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {habitStreaks && habitStreaks.length > 0 ? (
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <BarChart data={habitStreaks} layout="vertical">
                                    <defs>
                                        <linearGradient id="currentStreakGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                                            <stop offset="100%" stopColor="#A855F7" stopOpacity={0.8} />
                                        </linearGradient>
                                        <linearGradient id="bestStreakGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.6} />
                                            <stop offset="100%" stopColor="#FBBF24" stopOpacity={0.4} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis
                                        dataKey="title"
                                        type="category"
                                        className="text-xs"
                                        width={100}
                                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="currentStreak" fill="url(#currentStreakGradient)" radius={[0, 6, 6, 0]} />
                                    <Bar dataKey="bestStreak" fill="url(#bestStreakGradient)" radius={[0, 6, 6, 0]} />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <EmptyState message="No habits yet" />
                        )}
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                        <CardDescription>How your habits are categorized</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categoryBreakdown && categoryBreakdown.length > 0 ? (
                            <div className="flex items-center justify-center">
                                <ChartContainer config={{ count: { label: "Habits" } }} className="h-[250px] w-full max-w-[300px]">
                                    <PieChart>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Pie
                                            data={categoryBreakdown}
                                            dataKey="count"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={90}
                                        >
                                            {categoryBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                                <div className="ml-4 space-y-2">
                                    {categoryBreakdown.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                                            <span className="text-sm">{item.category}: {item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <EmptyState message="No habits yet" />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Habits Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Performing Habits</CardTitle>
                    <CardDescription>Your habits ranked by streak performance</CardDescription>
                </CardHeader>
                <CardContent>
                    {habitStreaks && habitStreaks.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Habit</TableHead>
                                    <TableHead>Current Streak</TableHead>
                                    <TableHead>Best Streak</TableHead>
                                    <TableHead>Performance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {habitStreaks.slice(0, 5).map((habit, index) => (
                                    <TableRow key={habit.habitId}>
                                        <TableCell className="font-medium">#{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: habit.color }}
                                                />
                                                {habit.title}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{habit.currentStreak} days</Badge>
                                        </TableCell>
                                        <TableCell>{habit.bestStreak} days</TableCell>
                                        <TableCell>
                                            <Progress
                                                value={habit.bestStreak > 0 ? (habit.currentStreak / habit.bestStreak) * 100 : 0}
                                                className="w-20"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <EmptyState message="No habits yet. Create some habits to see insights!" />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-[200px] items-center justify-center text-muted-foreground">
            {message}
        </div>
    );
}
