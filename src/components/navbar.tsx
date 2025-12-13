"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-800 transition-transform group-hover:scale-105">
                            <Sparkles className="h-5 w-5 text-zinc-300" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            HabitCapsule
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:gap-6">
                        <Link
                            href="/#features"
                            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                        >
                            Features
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/#testimonials"
                            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                        >
                            Testimonials
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <SignedOut>
                            <Link href="/sign-in" className="hidden sm:block">
                                <Button
                                    variant="ghost"
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                >
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0">
                                    Get Started
                                </Button>
                            </Link>
                        </SignedOut>

                        <SignedIn>
                            <Link href="/dashboard">
                                <Button
                                    variant="ghost"
                                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9",
                                        userButtonPopoverCard: "bg-zinc-900 border-zinc-800",
                                        userButtonPopoverActionButton: "text-zinc-300 hover:bg-zinc-800",
                                        userButtonPopoverActionButtonText: "text-zinc-300",
                                        userButtonPopoverFooter: "hidden",
                                    },
                                }}
                            />
                        </SignedIn>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 text-zinc-400 hover:text-white"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-zinc-800 py-4">
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/#features"
                                className="px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="/pricing"
                                className="px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Pricing
                            </Link>
                            <Link
                                href="/#testimonials"
                                className="px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Testimonials
                            </Link>
                            <SignedOut>
                                <Link
                                    href="/sign-in"
                                    className="px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white sm:hidden"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                            </SignedOut>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
