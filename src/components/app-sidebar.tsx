"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
    Home,
    Target,
    BarChart3,
    Calendar,
    Download,
    Settings,
    Sparkles,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";

const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Habits", href: "/dashboard/habits", icon: Target },
    { name: "Insights", href: "/dashboard/insights", icon: BarChart3 },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
    { name: "Export", href: "/dashboard/export", icon: Download },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                                    <Sparkles className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">HabitCapsule</span>
                                    <span className="text-xs text-muted-foreground">
                                        Build better habits
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => {
                                const isActive =
                                    pathname === item.href ||
                                    (item.href !== "/dashboard" && pathname.startsWith(item.href));

                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                                            <Link href={item.href}>
                                                <item.icon className="size-4" />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" className="w-full">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "size-8",
                                    },
                                }}
                            />
                            <div className="flex flex-col gap-0.5 leading-none text-left">
                                <span className="font-medium truncate">
                                    {user?.firstName || user?.username || "User"}
                                </span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {user?.emailAddresses[0]?.emailAddress}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
