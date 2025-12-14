import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "HabitCapsule Privacy Policy. Learn how we collect, use, and protect your personal data. Your privacy matters to us.",
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            <section className="py-24">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-black text-white mb-8">Privacy Policy</h1>
                    <p className="text-zinc-400 mb-8">Last updated: December 2024</p>

                    <div className="prose prose-invert prose-zinc max-w-none space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We collect information you provide directly to us, such as when you create an account,
                                use our services, or contact us for support. This may include your name, email address,
                                and habit tracking data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                            <p className="text-zinc-400 leading-relaxed mb-4">We use the information we collect to:</p>
                            <ul className="list-disc list-inside text-zinc-400 space-y-2">
                                <li>Provide, maintain, and improve our services</li>
                                <li>Send you technical notices and support messages</li>
                                <li>Respond to your comments and questions</li>
                                <li>Analyze usage patterns to improve user experience</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">3. Data Storage and Security</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We implement appropriate security measures to protect your personal information.
                                Your data is stored securely using industry-standard encryption and security practices.
                                We use trusted third-party services for authentication (Clerk) and database storage (Convex).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">4. Data Sharing</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We do not sell, trade, or rent your personal information to third parties.
                                We may share your information only with service providers who assist us in operating
                                our platform and are bound by confidentiality agreements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">5. Your Rights</h2>
                            <p className="text-zinc-400 leading-relaxed mb-4">You have the right to:</p>
                            <ul className="list-disc list-inside text-zinc-400 space-y-2">
                                <li>Access your personal data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Export your data in a portable format</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">6. Cookies</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We use essential cookies to maintain your session and preferences.
                                These cookies are necessary for the proper functioning of our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">7. Contact Us</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at
                                support@habitcapsule.com.
                            </p>
                        </section>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800/50 py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                                <Sparkles className="h-5 w-5 text-zinc-300" />
                            </div>
                            <span className="font-bold text-lg text-white">HabitCapsule</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-zinc-500">
                            <Link href="/pricing" className="hover:text-zinc-300 transition-colors">
                                Pricing
                            </Link>
                            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
