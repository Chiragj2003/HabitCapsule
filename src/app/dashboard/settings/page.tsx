"use client";

import { useState } from "react";
import { useUser, UserProfile } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Trash2, UserX, Settings as SettingsIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";

export default function SettingsPage() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const { theme, setTheme } = useTheme();
    const clerkId = user?.id || "";

    const deactivateUser = useMutation(api.users.deactivateUser);
    const deleteUser = useMutation(api.users.deleteUser);

    const [isDeactivating, setIsDeactivating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeactivate = async () => {
        if (!clerkId) return;
        setIsDeactivating(true);
        try {
            await deactivateUser({ clerkId });
            toast.success("Account deactivated. You can reactivate by contacting support.");
            await signOut();
        } catch {
            toast.error("Failed to deactivate account");
        } finally {
            setIsDeactivating(false);
        }
    };

    const handleDelete = async () => {
        if (!clerkId) return;
        setIsDeleting(true);
        try {
            await deleteUser({ clerkId });
            toast.success("Account and all data deleted.");
            await signOut();
        } catch {
            toast.error("Failed to delete account");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your preferences and account
                </p>
            </div>

            {/* Theme Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sun className="h-5 w-5" />
                        Appearance
                    </CardTitle>
                    <CardDescription>
                        Customize how HabitCapsule looks on your device
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Label>Theme</Label>
                        <RadioGroup
                            value={theme}
                            onValueChange={setTheme}
                            className="grid grid-cols-3 gap-4"
                        >
                            <Label
                                htmlFor="light"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
                            >
                                <RadioGroupItem value="light" id="light" className="sr-only" />
                                <Sun className="mb-3 h-6 w-6" />
                                <span className="text-sm font-medium">Light</span>
                            </Label>
                            <Label
                                htmlFor="dark"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
                            >
                                <RadioGroupItem value="dark" id="dark" className="sr-only" />
                                <Moon className="mb-3 h-6 w-6" />
                                <span className="text-sm font-medium">Dark</span>
                            </Label>
                            <Label
                                htmlFor="system"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
                            >
                                <RadioGroupItem value="system" id="system" className="sr-only" />
                                <Monitor className="mb-3 h-6 w-6" />
                                <span className="text-sm font-medium">System</span>
                            </Label>
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Settings - Clerk UserProfile */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <SettingsIcon className="h-5 w-5" />
                        Profile Settings
                    </CardTitle>
                    <CardDescription>
                        Manage your account details and security
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UserProfile
                        routing="hash"
                        appearance={{
                            baseTheme: undefined,
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none border-0 p-0 bg-transparent",
                                navbar: "hidden",
                                pageScrollBox: "p-0",
                                page: "p-0",
                                profileSection: "bg-transparent",
                                profileSectionContent: "bg-transparent",
                                formFieldInput: "bg-zinc-900 border-zinc-700 text-white",
                                formButtonPrimary: "bg-violet-600 hover:bg-violet-700",
                                headerTitle: "text-foreground",
                                headerSubtitle: "text-muted-foreground",
                                formFieldLabel: "text-foreground",
                                accordionTriggerButton: "text-foreground hover:bg-zinc-800",
                                accordionContent: "bg-transparent",
                                profileSectionPrimaryButton: "text-violet-400 hover:text-violet-300",
                                badge: "bg-zinc-800 text-zinc-300",
                                menuButton: "hover:bg-zinc-800",
                                menuItem: "hover:bg-zinc-800",
                            },
                            variables: {
                                colorBackground: "transparent",
                                colorInputBackground: "hsl(var(--muted))",
                                colorText: "hsl(var(--foreground))",
                                colorTextSecondary: "hsl(var(--muted-foreground))",
                                colorPrimary: "#8B5CF6",
                            },
                        }}
                    />
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <Trash2 className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Irreversible actions that affect your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Log Out */}
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                            <h4 className="font-medium flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                Log Out
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Sign out of your account on this device.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => signOut({ redirectUrl: "/" })}
                        >
                            Log Out
                        </Button>
                    </div>

                    <Separator />

                    {/* Deactivate Account */}
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                            <h4 className="font-medium flex items-center gap-2">
                                <UserX className="h-4 w-4" />
                                Deactivate Account
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Temporarily disable your account. Your data will be preserved.
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">Deactivate</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Deactivate Account</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will deactivate your account. Your data will be preserved
                                        and you can reactivate by contacting support.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeactivate}
                                        disabled={isDeactivating}
                                    >
                                        {isDeactivating ? "Deactivating..." : "Deactivate"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <Separator />

                    {/* Delete Account */}
                    <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
                        <div>
                            <h4 className="font-medium text-destructive flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all data. This cannot be undone.
                            </p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action is permanent and cannot be undone. All your habits,
                                        entries, and data will be permanently deleted.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {isDeleting ? "Deleting..." : "Delete Account"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardContent>
            </Card>

            {/* Legal & Pricing */}
            <Card>
                <CardHeader>
                    <CardTitle>Legal & Pricing</CardTitle>
                    <CardDescription>
                        View our policies and pricing information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <a href="/pricing" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                                View Pricing
                            </Button>
                        </a>
                        <a href="/privacy" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                                Privacy Policy
                            </Button>
                        </a>
                        <a href="/terms" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                                Terms of Service
                            </Button>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
