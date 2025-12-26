"use client";

import { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
    Plus,
    Pencil,
    Trash2,
    MoreHorizontal,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Hash,
    CheckCircle2,
    Zap,
    Target,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const CATEGORIES = [
    "Health",
    "Fitness",
    "Productivity",
    "Learning",
    "Mindfulness",
    "Social",
    "Finance",
    "Other",
];

const COLORS = [
    "#F87171", // Red
    "#FB923C", // Orange  
    "#FBBF24", // Yellow
    "#4ADE80", // Green
    "#22D3EE", // Cyan
    "#60A5FA", // Blue
    "#A78BFA", // Purple
    "#F472B6", // Pink
];

const CATEGORY_ICONS: Record<string, string> = {
    Health: "💪",
    Fitness: "🏃",
    Productivity: "📈",
    Learning: "📚",
    Mindfulness: "🧘",
    Social: "👥",
    Finance: "💰",
    Other: "📌",
};

type Habit = {
    _id: Id<"habits">;
    title: string;
    description?: string;
    category?: string;
    color: string;
    goalType: "binary" | "duration" | "quantity";
    goalTarget?: number;
    unit?: string;
    active: boolean;
    todayCompleted?: boolean;
};

type Entry = {
    _id: Id<"entries">;
    habitId: Id<"habits">;
    entryDate: string;
    completed: boolean;
    value?: number;
    notes?: string;
};

// Helper functions
const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

const isFutureDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
};

// Check if date is within editable range (today and past 2 days only)
const isEditableDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Calculate difference in days
    const diffTime = today.getTime() - checkDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Editable if today (0) or past 1-2 days, but not future
    return diffDays >= 0 && diffDays <= 2;
};

export default function HabitsPage() {
    const { user, isLoaded } = useUser();
    const clerkId = user?.id || "";

    // Current month/year for calendar view
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Calculate date range for current month
    const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
    const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

    const habits = useQuery(
        api.habits.getHabitsWithTodayStatus,
        clerkId ? { clerkId } : "skip"
    );

    const entries = useQuery(
        api.entries.getEntriesInRange,
        clerkId ? { clerkId, startDate, endDate } : "skip"
    );

    const createHabit = useMutation(api.habits.createHabit);
    const updateHabit = useMutation(api.habits.updateHabit);
    const deleteHabit = useMutation(api.habits.deleteHabit);
    const toggleEntry = useMutation(api.entries.toggleEntry);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
    const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set());

    // Generate days for the month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        return new Date(currentYear, currentMonth, i + 1);
    });

    // Get entry for a specific habit and date
    const getEntry = useCallback(
        (habitId: Id<"habits">, date: Date): Entry | undefined => {
            if (!entries) return undefined;
            const dateStr = formatDate(date);
            return entries.find(
                (e) => e.habitId === habitId && e.entryDate === dateStr
            );
        },
        [entries]
    );

    // Handle cell click to toggle habit
    const handleCellClick = async (habit: Habit, date: Date) => {
        if (!clerkId || !habit.active) return;

        // Only allow editing today and past 2 days
        if (!isEditableDate(date)) {
            toast.error("You can only edit today and the past 2 days");
            return;
        }

        const dateStr = formatDate(date);
        const cellKey = `${habit._id}-${dateStr}`;

        setLoadingCells((prev) => new Set(prev).add(cellKey));

        try {
            await toggleEntry({
                clerkId,
                habitId: habit._id,
                entryDate: dateStr,
            });
        } catch {
            toast.error("Failed to update habit");
        } finally {
            setLoadingCells((prev) => {
                const next = new Set(prev);
                next.delete(cellKey);
                return next;
            });
        }
    };

    // Navigation functions
    const goToPrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

    // Calculate weekly completion
    const getWeeklyCompletion = (weekStart: number) => {
        if (!habits || !entries) return 0;
        let completed = 0;
        let total = 0;
        const activeHabits = habits.filter(h => h.active);

        for (let i = weekStart; i < Math.min(weekStart + 7, daysInMonth + 1); i++) {
            const date = new Date(currentYear, currentMonth, i);
            if (!isFutureDate(date)) {
                total += activeHabits.length;
                activeHabits.forEach(habit => {
                    const entry = getEntry(habit._id, date);
                    if (entry?.completed) completed++;
                });
            }
        }
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    // Get week boundaries
    const weeks: number[] = [];
    for (let i = 1; i <= daysInMonth; i += 7) {
        weeks.push(i);
    }

    if (!isLoaded || habits === undefined) {
        return <HabitsPageSkeleton />;
    }

    const activeHabits = habits.filter(h => h.active);

    // Get goal display text
    const getGoalDisplay = (habit: Habit) => {
        if (habit.goalType === "duration" && habit.goalTarget) {
            return `${habit.goalTarget}${habit.unit || "minutes"}`;
        }
        if (habit.goalType === "quantity" && habit.goalTarget) {
            return `${habit.goalTarget}${habit.unit || "x"}`;
        }
        return null;
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-full mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Habits</h1>
                    <p className="text-zinc-400 text-sm sm:text-base mt-1">
                        Track your daily habits and build consistency
                    </p>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToPrevMonth}
                        className="h-8 w-8 text-zinc-400 hover:text-white"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-lg font-semibold text-white min-w-[160px] text-center">
                        {monthName}
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToNextMonth}
                        className="h-8 w-8 text-zinc-400 hover:text-white"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid Card */}
            <Card className="bg-zinc-900/50 border-zinc-800/50 overflow-hidden">
                {/* Header Row with Month and Add Button */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-800/50">
                    <h2 className="text-lg font-semibold text-white">
                        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                    </h2>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Habit
                    </Button>
                </div>

                {/* Calendar Grid */}
                <div className="overflow-x-auto">
                    {activeHabits.length > 0 ? (
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-zinc-800/50">
                                    <th className="sticky left-0 z-10 bg-zinc-900/95 backdrop-blur-sm px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-48">
                                        Habit
                                    </th>
                                    {days.map((day) => {
                                        const today = isToday(day);
                                        const editable = isEditableDate(day);
                                        const future = isFutureDate(day);

                                        return (
                                            <th
                                                key={day.toISOString()}
                                                className={`
                                                    px-0.5 py-2 text-center w-8 min-w-8
                                                    ${today
                                                        ? 'bg-zinc-700/50'
                                                        : ''
                                                    }
                                                `}
                                            >
                                                <div className={`
                                                    text-xs font-bold
                                                    ${today
                                                        ? 'text-white'
                                                        : future
                                                            ? 'text-zinc-600'
                                                            : 'text-zinc-400'
                                                    }
                                                `}>
                                                    {day.getDate()}
                                                </div>
                                                <div className={`
                                                    text-[10px] uppercase
                                                    ${today
                                                        ? 'text-zinc-300'
                                                        : future
                                                            ? 'text-zinc-700'
                                                            : 'text-zinc-600'
                                                    }
                                                `}>
                                                    {day.toLocaleDateString('en', { weekday: 'narrow' })}
                                                </div>
                                            </th>
                                        );
                                    })}
                                    <th className="px-3 py-3 text-center text-xs font-medium text-zinc-500 uppercase tracking-wider">

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeHabits.map((habit) => {
                                    const completedCount = entries?.filter(
                                        (e) => e.habitId === habit._id && e.completed
                                    ).length ?? 0;
                                    const goalDisplay = getGoalDisplay(habit);

                                    return (
                                        <tr
                                            key={habit._id}
                                            className="border-b border-zinc-800/30 hover:bg-zinc-800/20 transition-colors group"
                                        >
                                            {/* Habit Name Cell */}
                                            <td className="sticky left-0 z-10 bg-zinc-900/95 backdrop-blur-sm px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-2.5 w-2.5 rounded-full shrink-0"
                                                        style={{ backgroundColor: habit.color }}
                                                    />
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="text-sm font-medium text-white truncate">
                                                            {habit.title}
                                                        </span>
                                                        {goalDisplay && (
                                                            <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 shrink-0">
                                                                {goalDisplay}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-auto"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                                                            <DropdownMenuItem
                                                                onClick={() => setEditingHabit(habit)}
                                                                className="text-zinc-300 focus:text-white focus:bg-zinc-800"
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-400 focus:text-red-300 focus:bg-zinc-800"
                                                                onClick={() => setDeletingHabit(habit)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>

                                            {/* Day Cells */}
                                            {days.map((day) => {
                                                const entry = getEntry(habit._id, day);
                                                const dateStr = formatDate(day);
                                                const cellKey = `${habit._id}-${dateStr}`;
                                                const isLoading = loadingCells.has(cellKey);
                                                const today = isToday(day);
                                                const editable = isEditableDate(day);
                                                const future = isFutureDate(day);
                                                const isCompleted = entry?.completed;

                                                return (
                                                    <td
                                                        key={day.toISOString()}
                                                        className={`
                                                            px-0.5 py-2 text-center
                                                            ${today ? 'bg-zinc-700/30' : ''}
                                                        `}
                                                    >
                                                        <button
                                                            onClick={() => handleCellClick(habit, day)}
                                                            disabled={!editable || isLoading}
                                                            className={`
                                                                w-6 h-6 rounded flex items-center justify-center mx-auto
                                                                transition-all duration-150
                                                                ${isCompleted
                                                                    ? ''
                                                                    : 'border border-zinc-700'
                                                                }
                                                                ${future
                                                                    ? 'opacity-20 cursor-not-allowed border-zinc-800'
                                                                    : editable
                                                                        ? 'cursor-pointer hover:border-zinc-500'
                                                                        : 'opacity-40 cursor-not-allowed'
                                                                }
                                                                ${isLoading ? 'animate-pulse' : ''}
                                                            `}
                                                            style={{
                                                                backgroundColor: isCompleted ? habit.color : 'transparent',
                                                            }}
                                                            title={
                                                                future
                                                                    ? "Future date"
                                                                    : editable
                                                                        ? "Click to toggle"
                                                                        : "Only past 2 days are editable"
                                                            }
                                                        >
                                                            {isCompleted && (
                                                                <Check className="h-3.5 w-3.5 text-zinc-900" strokeWidth={3} />
                                                            )}
                                                        </button>
                                                    </td>
                                                );
                                            })}

                                            {/* Total Cell */}
                                            <td className="px-3 py-3 text-right">
                                                <span className="text-sm font-medium text-white">{completedCount}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                            <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                                <Plus className="h-8 w-8 text-zinc-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No habits yet</h3>
                            <p className="text-zinc-500 mb-6 max-w-sm">
                                Create your first habit to start tracking
                            </p>
                            <Button
                                onClick={() => setIsCreateOpen(true)}
                                className="bg-white hover:bg-zinc-200 text-zinc-900 font-semibold"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Habit
                            </Button>
                        </div>
                    )}
                </div>

                {/* Weekly Summary Footer */}
                {activeHabits.length > 0 && (
                    <div className="px-6 py-4 bg-zinc-800/30 border-t border-zinc-800/50">
                        <div className="flex items-center gap-6 text-sm flex-wrap">
                            <span className="text-zinc-500 font-medium">Weekly completion:</span>
                            {weeks.map((weekStart, i) => {
                                const percentage = getWeeklyCompletion(weekStart);
                                return (
                                    <div key={weekStart} className="flex items-center gap-2">
                                        <span className="text-zinc-600 text-xs">W{i + 1}:</span>
                                        <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-white transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-zinc-400 text-xs font-medium w-8">{percentage}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </Card>

            {/* Create Habit Dialog */}
            <HabitDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSave={async (data) => {
                    try {
                        const { active, ...createData } = data;
                        await createHabit({ clerkId, ...createData });
                        toast.success("Habit created!");
                        setIsCreateOpen(false);
                    } catch {
                        toast.error("Failed to create habit");
                    }
                }}
            />

            {/* Edit Habit Dialog */}
            {editingHabit && (
                <HabitDialog
                    open={!!editingHabit}
                    onOpenChange={(open) => !open && setEditingHabit(null)}
                    habit={editingHabit}
                    onSave={async (data) => {
                        try {
                            await updateHabit({ habitId: editingHabit._id, ...data });
                            toast.success("Habit updated!");
                            setEditingHabit(null);
                        } catch {
                            toast.error("Failed to update habit");
                        }
                    }}
                />
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingHabit} onOpenChange={(open) => !open && setDeletingHabit(null)}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Habit</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Are you sure you want to delete &quot;{deletingHabit?.title}&quot;? This will also
                            delete all associated entries.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 text-white hover:bg-red-700"
                            onClick={async () => {
                                if (!deletingHabit) return;
                                try {
                                    await deleteHabit({ habitId: deletingHabit._id });
                                    toast.success("Habit deleted");
                                    setDeletingHabit(null);
                                } catch {
                                    toast.error("Failed to delete habit");
                                }
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function HabitDialog({
    open,
    onOpenChange,
    habit,
    onSave,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    habit?: Habit;
    onSave: (data: {
        title: string;
        description?: string;
        category?: string;
        color: string;
        goalType: "binary" | "duration" | "quantity";
        goalTarget?: number;
        unit?: string;
        active?: boolean;
    }) => Promise<void>;
}) {
    const [title, setTitle] = useState(habit?.title ?? "");
    const [description, setDescription] = useState(habit?.description ?? "");
    const [category, setCategory] = useState(habit?.category ?? "");
    const [color, setColor] = useState(habit?.color ?? COLORS[0]);
    const [goalType, setGoalType] = useState<"binary" | "duration" | "quantity">(
        habit?.goalType ?? "binary"
    );
    const [goalTarget, setGoalTarget] = useState(habit?.goalTarget?.toString() ?? "");
    const [unit, setUnit] = useState(habit?.unit ?? "");
    const [active, setActive] = useState(habit?.active ?? true);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setSaving(true);
        try {
            await onSave({
                title: title.trim(),
                description: description.trim() || undefined,
                category: category || undefined,
                color,
                goalType,
                goalTarget: goalTarget ? parseInt(goalTarget) : undefined,
                unit: unit.trim() || undefined,
                active,
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {habit ? "Edit Habit" : "Create New Habit"}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {habit ? "Update your habit details." : "Add a new habit to track."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-zinc-300">Name *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., meditation"
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                            required
                        />
                    </div>

                    {/* Goal Type & Target */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Type</Label>
                            <Select
                                value={goalType}
                                onValueChange={(v) => setGoalType(v as "binary" | "duration" | "quantity")}
                            >
                                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    <SelectItem value="binary" className="text-zinc-300 focus:text-white focus:bg-zinc-800">
                                        Yes/No
                                    </SelectItem>
                                    <SelectItem value="duration" className="text-zinc-300 focus:text-white focus:bg-zinc-800">
                                        Duration
                                    </SelectItem>
                                    <SelectItem value="quantity" className="text-zinc-300 focus:text-white focus:bg-zinc-800">
                                        Quantity
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {goalType !== "binary" && (
                            <div className="space-y-2">
                                <Label htmlFor="goalTarget" className="text-zinc-300">Target</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="goalTarget"
                                        type="number"
                                        value={goalTarget}
                                        onChange={(e) => setGoalTarget(e.target.value)}
                                        placeholder="30"
                                        min={1}
                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 w-20"
                                    />
                                    <Input
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        placeholder={goalType === "duration" ? "min" : "x"}
                                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 flex-1"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-2">
                        <Label className="text-zinc-300">Color</Label>
                        <div className="flex gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`
                                        h-7 w-7 rounded-full transition-all
                                        ${color === c
                                            ? "ring-2 ring-offset-2 ring-offset-zinc-900 ring-white scale-110"
                                            : "hover:scale-105"
                                        }
                                    `}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Active Toggle (only for edit) */}
                    {habit && (
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-zinc-800/50">
                            <Checkbox
                                id="active"
                                checked={active}
                                onCheckedChange={(checked) => setActive(checked as boolean)}
                            />
                            <Label htmlFor="active" className="text-zinc-300 cursor-pointer">
                                Active
                            </Label>
                        </div>
                    )}

                    {/* Actions */}
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving || !title.trim()}
                            className="bg-white text-zinc-900 hover:bg-zinc-200"
                        >
                            {saving ? "Saving..." : habit ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function HabitsPageSkeleton() {
    return (
        <div className="p-4 sm:p-6 space-y-6 max-w-full mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-32 bg-zinc-800" />
                    <Skeleton className="h-4 w-64 mt-2 bg-zinc-800" />
                </div>
                <Skeleton className="h-10 w-40 bg-zinc-800" />
            </div>
            <Skeleton className="h-96 w-full bg-zinc-800 rounded-xl" />
        </div>
    );
}
