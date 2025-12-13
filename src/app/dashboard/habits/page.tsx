"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Plus, Pencil, Trash2, Check, X, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
    "#FFB4A2",
    "#E5989B",
    "#B5838D",
    "#6D6875",
    "#A8DADC",
    "#457B9D",
    "#1D3557",
    "#F4A261",
    "#E76F51",
    "#2A9D8F",
];

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

export default function HabitsPage() {
    const { user } = useUser();
    const clerkId = user?.id || "";

    const habits = useQuery(
        api.habits.getHabitsWithTodayStatus,
        clerkId ? { clerkId } : "skip"
    );

    const createHabit = useMutation(api.habits.createHabit);
    const updateHabit = useMutation(api.habits.updateHabit);
    const deleteHabit = useMutation(api.habits.deleteHabit);
    const toggleEntry = useMutation(api.entries.toggleEntry);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
    const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

    const filteredHabits = habits?.filter((habit) => {
        if (filter === "active") return habit.active;
        if (filter === "inactive") return !habit.active;
        return true;
    });

    const handleToggle = async (habit: Habit) => {
        if (!clerkId) return;
        const today = new Date().toISOString().split("T")[0];

        try {
            await toggleEntry({
                clerkId,
                habitId: habit._id,
                entryDate: today,
            });
            toast.success(habit.todayCompleted ? "Habit unchecked" : "Habit completed! 🎉");
        } catch {
            toast.error("Failed to update habit");
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">My Habits</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Track and manage your daily habits
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add Habit
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className="flex-shrink-0"
                >
                    All
                </Button>
                <Button
                    variant={filter === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("active")}
                    className="flex-shrink-0"
                >
                    Active
                </Button>
                <Button
                    variant={filter === "inactive" ? "default" : "outline"}
                    className="flex-shrink-0"
                    size="sm"
                    onClick={() => setFilter("inactive")}
                >
                    Inactive
                </Button>
            </div>

            {/* Habits Table */}
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-base sm:text-lg">Your Habits</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                        {filteredHabits?.length ?? 0} habit{filteredHabits?.length !== 1 ? "s" : ""}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-2 sm:p-6 pt-0">
                    {filteredHabits && filteredHabits.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Today</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="hidden sm:table-cell">Category</TableHead>
                                        <TableHead className="hidden md:table-cell">Goal</TableHead>
                                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredHabits.map((habit) => (
                                        <TableRow key={habit._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={habit.todayCompleted}
                                                    onCheckedChange={() => handleToggle(habit)}
                                                    disabled={!habit.active}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: habit.color }}
                                                    />
                                                    <div>
                                                        <p className="font-medium">{habit.title}</p>
                                                        {habit.description && (
                                                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                                {habit.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {habit.category && (
                                                    <Badge variant="secondary">{habit.category}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">
                                                    {habit.goalType === "binary"
                                                        ? "Complete"
                                                        : `${habit.goalTarget} ${habit.unit ?? ""}`}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={habit.active ? "default" : "outline"}>
                                                    {habit.active ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setEditingHabit(habit)}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => setDeletingHabit(habit)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-muted-foreground mb-4">
                                No habits yet. Create your first habit to get started!
                            </p>
                            <Button onClick={() => setIsCreateOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Habit
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create Habit Dialog */}
            <HabitDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSave={async (data) => {
                    try {
                        // Don't pass 'active' for create - it defaults to true
                        const { active, ...createData } = data;
                        await createHabit({ clerkId, ...createData });
                        toast.success("Habit created successfully!");
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
                            toast.success("Habit updated successfully!");
                            setEditingHabit(null);
                        } catch {
                            toast.error("Failed to update habit");
                        }
                    }}
                />
            )}

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingHabit} onOpenChange={(open) => !open && setDeletingHabit(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{deletingHabit?.title}&quot;? This will also
                            delete all associated entries. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{habit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
                    <DialogDescription>
                        {habit
                            ? "Update your habit details below."
                            : "Add a new habit to track. Fill in the details below."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Morning Meditation"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional description..."
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Goal Type</Label>
                            <Select
                                value={goalType}
                                onValueChange={(v) => setGoalType(v as "binary" | "duration" | "quantity")}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="binary">Complete (Yes/No)</SelectItem>
                                    <SelectItem value="duration">Duration</SelectItem>
                                    <SelectItem value="quantity">Quantity</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {goalType !== "binary" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="goalTarget">Target</Label>
                                <Input
                                    id="goalTarget"
                                    type="number"
                                    value={goalTarget}
                                    onChange={(e) => setGoalTarget(e.target.value)}
                                    placeholder="e.g., 30"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Input
                                    id="unit"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder="e.g., minutes"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex gap-2 flex-wrap">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    className={`h-8 w-8 rounded-full transition-all ${color === c ? "ring-2 ring-offset-2 ring-primary" : ""
                                        }`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                />
                            ))}
                        </div>
                    </div>

                    {habit && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="active"
                                checked={active}
                                onCheckedChange={(checked) => setActive(checked as boolean)}
                            />
                            <Label htmlFor="active">Active</Label>
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving || !title.trim()}>
                            {saving ? "Saving..." : habit ? "Update" : "Create"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
