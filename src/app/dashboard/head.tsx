import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard - Track Your Habits",
    description: "Your personal habit tracking dashboard. Monitor your progress, build streaks, and achieve your goals with HabitCapsule.",
    robots: {
        index: false, // Dashboard should not be indexed
        follow: false,
    },
};

export default function DashboardHead() {
    return null;
}
