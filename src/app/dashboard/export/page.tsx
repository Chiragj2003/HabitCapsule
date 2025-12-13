"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Download, FileSpreadsheet, FileText, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ExportPage() {
    const { user } = useUser();
    const clerkId = user?.id || "";

    const habits = useQuery(
        api.habits.getHabits,
        clerkId ? { clerkId } : "skip"
    );

    const [startDate, setStartDate] = useState<Date | undefined>(
        new Date(new Date().setMonth(new Date().getMonth() - 1))
    );
    const [endDate, setEndDate] = useState<Date | undefined>(new Date());
    const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(true);

    const entries = useQuery(
        api.entries.getEntriesInRange,
        clerkId && startDate && endDate
            ? {
                clerkId,
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
            }
            : "skip"
    );

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        if (checked) {
            setSelectedHabits([]);
        }
    };

    const handleHabitToggle = (habitId: string, checked: boolean) => {
        setSelectAll(false);
        if (checked) {
            setSelectedHabits([...selectedHabits, habitId]);
        } else {
            setSelectedHabits(selectedHabits.filter((id) => id !== habitId));
        }
    };

    const getFilteredEntries = () => {
        if (!entries || !habits) return [];

        const habitIds = selectAll
            ? habits.map((h) => h._id)
            : selectedHabits;

        return entries.filter((e) => habitIds.includes(e.habitId));
    };

    const exportAsCSV = () => {
        const filteredEntries = getFilteredEntries();
        if (filteredEntries.length === 0) {
            toast.error("No data to export");
            return;
        }

        const habitMap = new Map(habits?.map((h) => [h._id, h]) || []);

        const csvRows = [
            ["Date", "Habit", "Category", "Completed", "Value", "Notes"],
        ];

        filteredEntries.forEach((entry) => {
            const habit = habitMap.get(entry.habitId);
            csvRows.push([
                entry.entryDate,
                habit?.title || "Unknown",
                habit?.category || "",
                entry.completed ? "Yes" : "No",
                entry.value?.toString() || "",
                entry.notes || "",
            ]);
        });

        const csvContent = csvRows.map((row) => row.join(",")).join("\n");
        downloadFile(csvContent, "habit-data.csv", "text/csv");
        toast.success("CSV exported successfully!");
    };

    const exportAsPDF = () => {
        const filteredEntries = getFilteredEntries();
        if (filteredEntries.length === 0) {
            toast.error("No data to export");
            return;
        }

        const habitMap = new Map(habits?.map((h) => [h._id, h]) || []);

        // Create a simple HTML document for PDF
        const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Habit Data Export</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #333; }
    .meta { color: #666; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; }
    tr:nth-child(even) { background-color: #fafafa; }
    .completed { color: #22c55e; }
    .not-completed { color: #ef4444; }
  </style>
</head>
<body>
  <h1>HabitCapsule Export</h1>
  <div class="meta">
    <p>Exported by: ${user?.fullName || user?.emailAddresses[0]?.emailAddress}</p>
    <p>Date range: ${startDate ? format(startDate, "MMM d, yyyy") : ""} - ${endDate ? format(endDate, "MMM d, yyyy") : ""}</p>
    <p>Total entries: ${filteredEntries.length}</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Habit</th>
        <th>Category</th>
        <th>Status</th>
        <th>Value</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      ${filteredEntries
                .map((entry) => {
                    const habit = habitMap.get(entry.habitId);
                    return `
        <tr>
          <td>${entry.entryDate}</td>
          <td>${habit?.title || "Unknown"}</td>
          <td>${habit?.category || "-"}</td>
          <td class="${entry.completed ? "completed" : "not-completed"}">${entry.completed ? "✓ Completed" : "✗ Not completed"}</td>
          <td>${entry.value || "-"}</td>
          <td>${entry.notes || "-"}</td>
        </tr>
      `;
                })
                .join("")}
    </tbody>
  </table>
</body>
</html>
    `;

        // Open print dialog for PDF
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            printWindow.print();
            toast.success("PDF export opened in new window. Use print to save as PDF.");
        } else {
            toast.error("Please allow popups to export PDF");
        }
    };

    const downloadFile = (content: string, filename: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const filteredCount = getFilteredEntries().length;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Export</h1>
                <p className="text-muted-foreground">
                    Export your habit data as CSV or PDF
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Filters Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                        <CardDescription>
                            Select date range and habits to export
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Date Range */}
                        <div className="space-y-4">
                            <Label>Date Range</Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "justify-start text-left font-normal flex-1",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "MMM d, yyyy") : "Start date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <span className="hidden sm:flex items-center text-muted-foreground">to</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "justify-start text-left font-normal flex-1",
                                                !endDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "MMM d, yyyy") : "End date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Habit Selection */}
                        <div className="space-y-4">
                            <Label>Habits</Label>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="select-all"
                                        checked={selectAll}
                                        onCheckedChange={handleSelectAll}
                                    />
                                    <label
                                        htmlFor="select-all"
                                        className="text-sm font-medium cursor-pointer"
                                    >
                                        All habits
                                    </label>
                                </div>
                                <div className="pl-4 space-y-2">
                                    {habits?.map((habit) => (
                                        <div key={habit._id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={habit._id}
                                                checked={selectAll || selectedHabits.includes(habit._id)}
                                                onCheckedChange={(checked) =>
                                                    handleHabitToggle(habit._id, checked as boolean)
                                                }
                                                disabled={selectAll}
                                            />
                                            <label
                                                htmlFor={habit._id}
                                                className="text-sm cursor-pointer flex items-center gap-2"
                                            >
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: habit.color }}
                                                />
                                                {habit.title}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                {filteredCount} entries match your filters
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Export Options
                        </CardTitle>
                        <CardDescription>Choose your preferred format</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            className="w-full justify-start h-auto py-4"
                            variant="outline"
                            onClick={exportAsCSV}
                            disabled={filteredCount === 0}
                        >
                            <FileSpreadsheet className="mr-3 h-6 w-6 text-green-600" />
                            <div className="text-left">
                                <p className="font-medium">Export as CSV</p>
                                <p className="text-sm text-muted-foreground">
                                    Spreadsheet format, works with Excel
                                </p>
                            </div>
                        </Button>

                        <Button
                            className="w-full justify-start h-auto py-4"
                            variant="outline"
                            onClick={exportAsPDF}
                            disabled={filteredCount === 0}
                        >
                            <FileText className="mr-3 h-6 w-6 text-red-600" />
                            <div className="text-left">
                                <p className="font-medium">Export as PDF</p>
                                <p className="text-sm text-muted-foreground">
                                    Printable document format
                                </p>
                            </div>
                        </Button>

                        {filteredCount === 0 && (
                            <p className="text-sm text-muted-foreground text-center pt-4">
                                No data matches your filters. Adjust date range or habits.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
