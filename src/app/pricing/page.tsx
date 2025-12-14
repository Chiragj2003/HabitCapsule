import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, ArrowRight, Gift, X, Crown } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing - Free Habit Tracker Plans",
    description: "HabitCapsule pricing plans. Start free and get all Pro features at no cost. No credit card required. Build better habits with our free habit tracking app.",
    keywords: ["habit tracker pricing", "free habit tracker", "habit app cost", "habit tracker subscription", "free productivity app"],
    openGraph: {
        title: "HabitCapsule Pricing - Free Habit Tracker",
        description: "Get all Pro features completely free. No credit card required. Start building better habits today.",
    },
};

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-800/20 rounded-full blur-[180px]" />
                <div className="absolute top-20 right-20 w-[300px] h-[300px] bg-zinc-700/10 rounded-full blur-[100px]" />

                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    {/* Limited Offer Banner */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-600/50 bg-zinc-800/80 backdrop-blur-sm px-5 py-2.5 text-sm font-medium text-white mb-8 animate-pulse">
                        <Gift className="h-4 w-4" />
                        <span>🎉 Limited Time: All Pro Features FREE</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Simple, Transparent
                        <br />
                        <span className="text-zinc-400">Pricing</span>
                    </h1>
                    <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                        Start building better habits today. No hidden fees, no surprises.
                        Currently offering Pro features completely free!
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12 pb-24">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Basic Plan */}
                        <div className="group relative rounded-3xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-8 lg:p-10 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/50">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 text-xs text-zinc-400 mb-4">
                                        Starter
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                                    <p className="text-zinc-500 text-sm">Perfect for getting started</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-black text-white">₹0</span>
                                        <span className="text-zinc-500">/month</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-2">Free forever</p>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3 text-zinc-300 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800">
                                            <Check className="h-3 w-3 text-zinc-400" />
                                        </div>
                                        Up to 5 habits
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800">
                                            <Check className="h-3 w-3 text-zinc-400" />
                                        </div>
                                        Basic analytics
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800">
                                            <Check className="h-3 w-3 text-zinc-400" />
                                        </div>
                                        Streak tracking
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800">
                                            <Check className="h-3 w-3 text-zinc-400" />
                                        </div>
                                        Calendar view
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-300 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800">
                                            <Check className="h-3 w-3 text-zinc-400" />
                                        </div>
                                        CSV export
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-500 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800/50">
                                            <X className="h-3 w-3 text-zinc-600" />
                                        </div>
                                        <span className="line-through">Advanced analytics</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-500 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800/50">
                                            <X className="h-3 w-3 text-zinc-600" />
                                        </div>
                                        <span className="line-through">PDF export</span>
                                    </li>
                                </ul>

                                <Link href="/sign-up">
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 border-zinc-700 bg-zinc-800/50 text-white hover:bg-zinc-800 hover:border-zinc-600 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Pro Plan - FREE */}
                        <div className="group relative rounded-3xl border-2 border-zinc-600 bg-zinc-900/60 backdrop-blur-sm p-8 lg:p-10 transition-all duration-500 hover:border-zinc-500 hover:shadow-2xl hover:shadow-zinc-900/50">
                            {/* Popular badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-zinc-900 text-xs font-bold shadow-lg">
                                    <Crown className="h-3.5 w-3.5" />
                                    FREE FOR NOW
                                </div>
                            </div>

                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent" />
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-zinc-700/20 rounded-full blur-3xl" />

                            <div className="relative">
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-700/50 text-xs text-zinc-300 mb-4">
                                        <Zap className="h-3 w-3" />
                                        Most Popular
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                                    <p className="text-zinc-400 text-sm">All features unlocked</p>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-white">₹0</span>
                                        <span className="text-zinc-500">/month</span>
                                        <span className="text-lg text-zinc-500 line-through ml-2">₹99</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-2">🎁 Limited time offer</p>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3 text-white text-sm font-medium">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        <strong>Unlimited</strong>&nbsp;habits
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-200 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        Advanced analytics & insights
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-200 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        Priority streak tracking
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-200 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        Custom categories & colors
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-200 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        PDF & CSV export
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-200 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        Priority support
                                    </li>
                                    <li className="flex items-center gap-3 text-zinc-200 text-sm">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                        Early access to new features
                                    </li>
                                </ul>

                                <Link href="/sign-up">
                                    <Button className="w-full h-12 bg-white text-zinc-900 hover:bg-zinc-100 font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg">
                                        Get Pro Free
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Note */}
                    <div className="mt-16 text-center">
                        <div className="inline-block rounded-2xl bg-zinc-900/50 border border-zinc-800/50 px-8 py-6 max-w-lg">
                            <div className="flex items-center justify-center gap-2 text-white font-semibold mb-2">
                                <Gift className="h-5 w-5" />
                                Limited Time Offer
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                All Pro features are currently free. No credit card required.
                                Start building habits today!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 border-t border-zinc-800/50">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white text-center mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
                            <h3 className="text-white font-semibold mb-2">Is it really free?</h3>
                            <p className="text-zinc-400 text-sm">
                                Yes! We&apos;re currently offering all Pro features for free. No credit card required,
                                no hidden fees. Just sign up and start tracking.
                            </p>
                        </div>

                        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
                            <h3 className="text-white font-semibold mb-2">Will my data be safe?</h3>
                            <p className="text-zinc-400 text-sm">
                                Absolutely. We use industry-standard encryption and security practices.
                                Your data is stored securely and never shared with third parties.
                            </p>
                        </div>

                        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
                            <h3 className="text-white font-semibold mb-2">Can I export my data?</h3>
                            <p className="text-zinc-400 text-sm">
                                Yes! You can export your habit data anytime as CSV or PDF.
                                Your data is always yours.
                            </p>
                        </div>

                        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6">
                            <h3 className="text-white font-semibold mb-2">How long will the free offer last?</h3>
                            <p className="text-zinc-400 text-sm">
                                We haven&apos;t set an end date yet. We&apos;ll notify all users well in advance
                                before any changes to pricing.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800/50 py-12 bg-zinc-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-8 md:grid-cols-3 items-center">
                        {/* Logo & Tagline */}
                        <div className="flex flex-col items-center md:items-start gap-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800">
                                    <Sparkles className="h-5 w-5 text-zinc-300" />
                                </div>
                                <span className="font-bold text-lg text-white">HabitCapsule</span>
                            </div>
                            <p className="text-xs text-zinc-500">Build habits that stick.</p>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
                            <Link href="/pricing" className="hover:text-white transition-colors">
                                Pricing
                            </Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-white transition-colors">
                                Terms
                            </Link>
                        </div>

                        {/* Copyright */}
                        <div className="text-center md:text-right">
                            <p className="text-xs text-zinc-600">
                                © {new Date().getFullYear()} HabitCapsule
                            </p>
                            <p className="text-xs text-zinc-700 mt-1">
                                Made with ♥ for habit builders
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
