"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function CalendarPage() {
    const { user } = useUser();
    const clerkId = user?.id || "";
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get start and end of the month for entries query
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const startDate = startOfMonth.toISOString().split("T")[0];
    const endDate = endOfMonth.toISOString().split("T")[0];

    const entries = useQuery(
        api.entries.getEntriesInRange,
        clerkId ? { clerkId, startDate, endDate } : "skip"
    );

    const habits = useQuery(
        api.habits.getHabits,
        clerkId ? { clerkId, activeOnly: true } : "skip"
    );

    // Build calendar grid
    const firstDayOfMonth = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = [];

    // Fill in empty days at start
    for (let i = 0; i < firstDayOfMonth; i++) {
        currentWeek.push(null);
    }

    // Fill in days
    for (let day = 1; day <= daysInMonth; day++) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    }

    // Fill in remaining days
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    // Get completion data for each day
    const getDayData = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayEntries = entries?.filter((e) => e.entryDate === dateStr) || [];
        const completed = dayEntries.filter((e) => e.completed).length;
        const total = habits?.length || 0;
        return { completed, total, rate: total > 0 ? completed / total : 0 };
    };

    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(year, month + direction, 1));
    };

    const today = new Date();
    const isToday = (day: number) =>
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

    // Previous months for sidebar
    const prevMonth1 = new Date(year, month - 1, 1);
    const prevMonth2 = new Date(year, month - 2, 1);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Calendar</h1>
                <p className="text-muted-foreground">
                    View your habit progress over time
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
                {/* Main Calendar */}
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle>{MONTHS[month]} {year}</CardTitle>
                            <CardDescription>
                                {habits?.length ?? 0} active habits
                            </CardDescription>
                        </div>
                        <div className="flex gap-1">
                            <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentDate(new Date())}
                            >
                                Today
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {/* Header */}
                            {DAYS.map((day) => (
                                <div
                                    key={day}
                                    className="p-2 text-center text-sm font-medium text-muted-foreground"
                                >
                                    {day}
                                </div>
                            ))}

                            {/* Days */}
                            {weeks.map((week, weekIndex) =>
                                week.map((day, dayIndex) => {
                                    if (day === null) {
                                        return <div key={`${weekIndex}-${dayIndex}`} className="p-2" />;
                                    }

                                    const { completed, total, rate } = getDayData(day);
                                    const isTodayCell = isToday(day);

                                    return (
                                        <div
                                            key={`${weekIndex}-${dayIndex}`}
                                            className={cn(
                                                "relative p-2 min-h-[80px] rounded-lg border transition-colors",
                                                isTodayCell
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "text-sm font-medium",
                                                isTodayCell && "text-primary"
                                            )}>
                                                {day}
                                            </div>
                                            {total > 0 && (
                                                <div className="mt-1">
                                                    <div
                                                        className={cn(
                                                            "h-1.5 rounded-full",
                                                            rate === 0
                                                                ? "bg-muted"
                                                                : rate < 0.5
                                                                    ? "bg-orange-500"
                                                                    : rate < 1
                                                                        ? "bg-yellow-500"
                                                                        : "bg-green-500"
                                                        )}
                                                        style={{ width: `${Math.max(rate * 100, 10)}%` }}
                                                    />
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {completed}/{total}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-muted" />
                                <span className="text-muted-foreground">0%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-orange-500" />
                                <span className="text-muted-foreground">&lt;50%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                <span className="text-muted-foreground">&lt;100%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                <span className="text-muted-foreground">100%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar with Previous Months */}
                <div className="space-y-4">
                    <MiniCalendar date={prevMonth1} clerkId={clerkId} />
                    <MiniCalendar date={prevMonth2} clerkId={clerkId} />
                </div>
            </div>
        </div>
    );
}

function MiniCalendar({ date, clerkId }: { date: Date; clerkId: string }) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const startDate = startOfMonth.toISOString().split("T")[0];
    const endDate = endOfMonth.toISOString().split("T")[0];

    const entries = useQuery(
        api.entries.getEntriesInRange,
        clerkId ? { clerkId, startDate, endDate } : "skip"
    );

    const habits = useQuery(
        api.habits.getHabits,
        clerkId ? { clerkId, activeOnly: true } : "skip"
    );

    const firstDayOfMonth = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    // Build mini grid
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
    }

    const getDayData = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayEntries = entries?.filter((e) => e.entryDate === dateStr) || [];
        const completed = dayEntries.filter((e) => e.completed).length;
        const total = habits?.length || 0;
        return { completed, total, rate: total > 0 ? completed / total : 0 };
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                    {MONTHS[month]} {year}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-0.5 text-xs">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <div key={i} className="text-center text-muted-foreground py-1">
                            {d}
                        </div>
                    ))}
                    {days.map((day, index) => {
                        if (day === null) {
                            return <div key={index} className="h-6" />;
                        }
                        const { rate } = getDayData(day);
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "h-6 flex items-center justify-center rounded text-xs",
                                    rate === 0
                                        ? ""
                                        : rate < 0.5
                                            ? "bg-orange-500/30"
                                            : rate < 1
                                                ? "bg-yellow-500/30"
                                                : "bg-green-500/30"
                                )}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
