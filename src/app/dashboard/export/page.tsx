"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Download, FileSpreadsheet, FileText, Calendar as CalendarIcon, Filter, BarChart3 } from "lucide-react";
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

    // Insights data for PDF export
    const stats = useQuery(api.analytics.getStats, clerkId ? { clerkId } : "skip");
    const weeklyTrend = useQuery(api.analytics.getWeeklyTrend, clerkId ? { clerkId } : "skip");
    const categoryBreakdown = useQuery(api.analytics.getCategoryBreakdown, clerkId ? { clerkId } : "skip");
    const habitStreaks = useQuery(api.analytics.getHabitStreaks, clerkId ? { clerkId } : "skip");

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

        // Calculate statistics for CSV header
        const completedEntries = filteredEntries.filter(e => e.completed).length;
        const completionRate = ((completedEntries / filteredEntries.length) * 100).toFixed(1);
        const uniqueHabits = new Set(filteredEntries.map(e => e.habitId)).size;
        const uniqueDates = new Set(filteredEntries.map(e => e.entryDate)).size;

        // Calculate habit-specific stats
        const habitStats: Record<string, { completed: number; total: number }> = {};
        filteredEntries.forEach(entry => {
            if (!habitStats[entry.habitId]) {
                habitStats[entry.habitId] = { completed: 0, total: 0 };
            }
            habitStats[entry.habitId].total++;
            if (entry.completed) habitStats[entry.habitId].completed++;
        });

        const csvRows: string[][] = [];

        // Summary section
        csvRows.push(["===== HABITCAPSULE EXPORT SUMMARY ====="]);
        csvRows.push([""]);
        csvRows.push(["Export Date", format(new Date(), "MMMM d, yyyy 'at' h:mm a")]);
        csvRows.push(["Exported By", user?.fullName || user?.emailAddresses[0]?.emailAddress || "Unknown"]);
        csvRows.push(["Date Range", `${startDate ? format(startDate, "MMM d, yyyy") : "N/A"} to ${endDate ? format(endDate, "MMM d, yyyy") : "N/A"}`]);
        csvRows.push([""]);
        csvRows.push(["===== STATISTICS ====="]);
        csvRows.push([""]);
        csvRows.push(["Total Entries", filteredEntries.length.toString()]);
        csvRows.push(["Completed Entries", completedEntries.toString()]);
        csvRows.push(["Completion Rate", `${completionRate}%`]);
        csvRows.push(["Total Habits Tracked", uniqueHabits.toString()]);
        csvRows.push(["Days Covered", uniqueDates.toString()]);
        csvRows.push([""]);

        // Habit-level summary
        csvRows.push(["===== HABIT PERFORMANCE ====="]);
        csvRows.push([""]);
        csvRows.push(["Habit Name", "Category", "Completed", "Total", "Completion Rate"]);
        Object.entries(habitStats).forEach(([habitId, s]) => {
            const habit = habitMap.get(habitId);
            const rate = ((s.completed / s.total) * 100).toFixed(1);
            csvRows.push([
                habit?.title || "Unknown",
                habit?.category || "Uncategorized",
                s.completed.toString(),
                s.total.toString(),
                `${rate}%`
            ]);
        });
        csvRows.push([""]);

        // Detailed entries
        csvRows.push(["===== DETAILED ENTRIES ====="]);
        csvRows.push([""]);
        csvRows.push(["Date", "Habit", "Category", "Completed", "Value", "Notes"]);

        filteredEntries
            .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
            .forEach((entry) => {
                const habit = habitMap.get(entry.habitId);
                csvRows.push([
                    entry.entryDate,
                    habit?.title || "Unknown",
                    habit?.category || "Uncategorized",
                    entry.completed ? "Yes" : "No",
                    entry.value?.toString() || "-",
                    `"${(entry.notes || "-").replace(/"/g, '""')}"`,
                ]);
            });

        const csvContent = csvRows.map((row) => row.join(",")).join("\n");
        const filename = `habitcapsule-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
        downloadFile(csvContent, filename, "text/csv");
        toast.success("CSV exported successfully with summary statistics!");
    };

    const exportAsPDF = () => {
        const filteredEntries = getFilteredEntries();
        if (filteredEntries.length === 0) {
            toast.error("No data to export");
            return;
        }

        const habitMap = new Map(habits?.map((h) => [h._id, h]) || []);

        // Calculate statistics
        const completedEntries = filteredEntries.filter(e => e.completed).length;
        const completionRate = ((completedEntries / filteredEntries.length) * 100).toFixed(1);

        const html = `
<!DOCTYPE html>
<html>
<head>
  <title>HabitCapsule Export</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      padding: 40px; 
      background: #fff;
      color: #1a1a1a;
      line-height: 1.6;
    }
    .header { 
      text-align: center; 
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #6366f1;
    }
    .header h1 { 
      font-size: 32px; 
      color: #1a1a1a; 
      margin-bottom: 8px;
    }
    .header .subtitle { 
      color: #6366f1; 
      font-size: 16px;
      font-weight: 500;
    }
    .meta { 
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
      border: 1px solid #e2e8f0;
    }
    .meta p { 
      margin: 6px 0; 
      color: #64748b;
      font-size: 14px;
    }
    .meta strong { color: #1a1a1a; }
    
    .stats-grid { 
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 16px; 
      margin-bottom: 30px;
    }
    .stat-card { 
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      color: white;
      box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3);
    }
    .stat-card.alt { background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%); }
    .stat-card.orange { background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%); }
    .stat-card.pink { background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); }
    .stat-value { 
      font-size: 28px; 
      font-weight: bold;
      display: block;
    }
    .stat-label { 
      font-size: 12px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .section { margin-bottom: 30px; }
    .section-title { 
      font-size: 20px; 
      color: #1a1a1a;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title::before {
      content: '';
      width: 4px;
      height: 20px;
      background: #6366f1;
      border-radius: 2px;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 10px;
      font-size: 13px;
    }
    th, td { 
      border: 1px solid #e2e8f0; 
      padding: 12px 16px; 
      text-align: left; 
    }
    th { 
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      font-weight: 600;
      color: #475569;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    tr:nth-child(even) { background-color: #fafafa; }
    tr:hover { background-color: #f1f5f9; }
    .completed { color: #16a34a; font-weight: 600; }
    .not-completed { color: #dc2626; }
    
    .habit-color { 
      display: inline-block; 
      width: 10px; 
      height: 10px; 
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
    }
    
    .weekly-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      margin-top: 10px;
    }
    .day-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .day-name { font-size: 12px; color: #64748b; margin-bottom: 4px; }
    .day-value { font-size: 18px; font-weight: bold; color: #1a1a1a; }
    
    .category-list { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; }
    .category-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .category-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
    }
    
    @media print {
      body { padding: 20px; }
      .stat-card { break-inside: avoid; }
      table { font-size: 11px; }
      th, td { padding: 8px 10px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎯 HabitCapsule</h1>
    <div class="subtitle">Your Habit Tracking Insights Report</div>
  </div>
  
  <div class="meta">
    <p><strong>Exported by:</strong> ${user?.fullName || user?.emailAddresses[0]?.emailAddress || "Unknown User"}</p>
    <p><strong>Report Generated:</strong> ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
    <p><strong>Date Range:</strong> ${startDate ? format(startDate, "MMMM d, yyyy") : ""} — ${endDate ? format(endDate, "MMMM d, yyyy") : ""}</p>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <span class="stat-value">${habits?.length ?? 0}</span>
      <span class="stat-label">Total Habits</span>
    </div>
    <div class="stat-card alt">
      <span class="stat-value">${stats?.activeHabits ?? 0}</span>
      <span class="stat-label">Active Habits</span>
    </div>
    <div class="stat-card orange">
      <span class="stat-value">${stats?.completionRate ?? completionRate}%</span>
      <span class="stat-label">Completion Rate</span>
    </div>
    <div class="stat-card pink">
      <span class="stat-value">${stats?.bestStreak ?? 0}</span>
      <span class="stat-label">Best Streak (Days)</span>
    </div>
  </div>

  ${weeklyTrend && weeklyTrend.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Weekly Performance</h2>
    <div class="weekly-grid">
      ${weeklyTrend.map(day => `
        <div class="day-card">
          <div class="day-name">${day.dayName}</div>
          <div class="day-value">${day.completed}</div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${categoryBreakdown && categoryBreakdown.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Category Distribution</h2>
    <div class="category-list">
      ${categoryBreakdown.map(cat => `
        <div class="category-item">
          <div class="category-dot" style="background-color: ${cat.fill}"></div>
          <span><strong>${cat.category}:</strong> ${cat.count} habits</span>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  ${habitStreaks && habitStreaks.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Habit Streaks</h2>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Habit</th>
          <th>Current Streak</th>
          <th>Best Streak</th>
          <th>Performance</th>
        </tr>
      </thead>
      <tbody>
        ${habitStreaks.slice(0, 10).map((habit, index) => `
          <tr>
            <td><strong>#${index + 1}</strong></td>
            <td>
              <span class="habit-color" style="background-color: ${habit.color}"></span>
              ${habit.title}
            </td>
            <td><strong>${habit.currentStreak}</strong> days</td>
            <td>${habit.bestStreak} days</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${habit.bestStreak > 0 ? (habit.currentStreak / habit.bestStreak) * 100 : 0}%; background: linear-gradient(90deg, #6366f1, #8b5cf6);"></div>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="section">
    <h2 class="section-title">Detailed Entry Log (${filteredEntries.length} entries)</h2>
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
                .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
                .slice(0, 50)
                .map((entry) => {
                    const habit = habitMap.get(entry.habitId);
                    return `
          <tr>
            <td>${format(new Date(entry.entryDate), "MMM d, yyyy")}</td>
            <td>
              <span class="habit-color" style="background-color: ${habit?.color || '#6366f1'}"></span>
              ${habit?.title || "Unknown"}
            </td>
            <td>${habit?.category || "-"}</td>
            <td class="${entry.completed ? "completed" : "not-completed"}">${entry.completed ? "✓ Completed" : "✗ Missed"}</td>
            <td>${entry.value || "-"}</td>
            <td>${entry.notes || "-"}</td>
          </tr>
        `;
                })
                .join("")}
        ${filteredEntries.length > 50 ? `
          <tr>
            <td colspan="6" style="text-align: center; font-style: italic; color: #64748b;">
              ... and ${filteredEntries.length - 50} more entries (download CSV for complete data)
            </td>
          </tr>
        ` : ''}
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>Generated by HabitCapsule • ${format(new Date(), "yyyy")} • Build better habits, one day at a time</p>
  </div>
</body>
</html>
    `;

        // Open print dialog for PDF
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 500);
            toast.success("PDF export opened. Use Print → Save as PDF to download.");
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
