import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Sparkles } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            <section className="py-24">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-black text-white mb-8">Terms of Service</h1>
                    <p className="text-zinc-400 mb-8">Last updated: December 2024</p>

                    <div className="prose prose-invert prose-zinc max-w-none space-y-8">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                By accessing and using HabitCapsule, you accept and agree to be bound by these Terms of Service.
                                If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                HabitCapsule is a habit tracking application that allows users to create, track,
                                and analyze their daily habits. We provide tools for streak tracking, analytics,
                                and data export.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">3. User Accounts</h2>
                            <p className="text-zinc-400 leading-relaxed mb-4">When you create an account, you agree to:</p>
                            <ul className="list-disc list-inside text-zinc-400 space-y-2">
                                <li>Provide accurate and complete information</li>
                                <li>Maintain the security of your account credentials</li>
                                <li>Notify us immediately of any unauthorized access</li>
                                <li>Accept responsibility for all activities under your account</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">4. Acceptable Use</h2>
                            <p className="text-zinc-400 leading-relaxed mb-4">You agree not to:</p>
                            <ul className="list-disc list-inside text-zinc-400 space-y-2">
                                <li>Use the service for any unlawful purpose</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Interfere with or disrupt the service</li>
                                <li>Upload malicious content or code</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">5. Subscription and Payments</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                HabitCapsule offers both free and paid subscription plans. Paid subscriptions are billed
                                monthly. You may cancel your subscription at any time, and it will remain active until
                                the end of the current billing period.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">6. Intellectual Property</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                The HabitCapsule service, including its design, features, and content, is owned by us
                                and protected by intellectual property laws. You retain ownership of the data you
                                create within the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                HabitCapsule is provided &ldquo;as is&rdquo; without warranties of any kind. We shall not be
                                liable for any indirect, incidental, or consequential damages arising from your use
                                of the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">8. Termination</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We reserve the right to suspend or terminate your account if you violate these terms.
                                You may also delete your account at any time through the settings page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">9. Changes to Terms</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                We may update these terms from time to time. We will notify you of significant changes
                                via email or through the service. Continued use after changes constitutes acceptance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4">10. Contact</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                For questions about these Terms of Service, please contact us at support@habitcapsule.com.
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
