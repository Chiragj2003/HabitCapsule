import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Target,
  BarChart3,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Zap,
  Trophy,
  TrendingUp,
  Star,
  Users,
  Shield,
  Flame,
  Download,
} from "lucide-react";

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HabitCapsule",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "10000",
  },
  description:
    "Build better habits with HabitCapsule - the free habit tracker app. Track daily habits, build streaks, visualize progress with beautiful analytics.",
  url: "https://habitcapsule.app",
  author: {
    "@type": "Organization",
    name: "HabitCapsule",
  },
  featureList: [
    "Unlimited habit tracking",
    "Streak tracking and motivation",
    "Beautiful analytics and charts",
    "Calendar view",
    "CSV and PDF export",
    "Category organization",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
        <Navbar />

        {/* Hero Section - Full Viewport Height */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Subtle background gradients - neutral tones */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-neutral-950" />

          {/* Subtle floating orbs - muted neutral */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-zinc-800/30 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-neutral-800/20 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-zinc-700/15 rounded-full blur-[120px]" />

          {/* Subtle animated dots */}
          <div className="absolute inset-0">
            <div className="absolute top-[15%] left-[20%] w-1 h-1 bg-zinc-500 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute top-[25%] right-[25%] w-1 h-1 bg-zinc-400 rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
            <div className="absolute top-[55%] left-[15%] w-1 h-1 bg-zinc-500 rounded-full animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
            <div className="absolute bottom-[25%] right-[20%] w-1 h-1 bg-zinc-400 rounded-full animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />
          </div>

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              {/* Minimal Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm px-5 py-2 text-sm font-medium text-zinc-300 mb-10">
                <Sparkles className="h-4 w-4 text-zinc-400" />
                <span>Build better habits, one day at a time</span>
              </div>

              {/* Main Headline - Clean white/gray */}
              <h1 className="text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.1]">
                <span className="block mb-3 text-white">Transform Your Life</span>
                <span className="block text-zinc-400">
                  One Habit at a Time
                </span>
              </h1>

              {/* Subheading */}
              <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-zinc-500 leading-relaxed">
                Build unbreakable streaks, visualize your progress with clean analytics,
                and join thousands who&apos;ve already transformed their daily routines.
              </p>

              {/* Feature pills - Neutral colors */}
              <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-sm font-medium">
                  <Flame className="h-4 w-4 text-zinc-400" />
                  <span>Streak Tracking</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-sm font-medium">
                  <BarChart3 className="h-4 w-4 text-zinc-400" />
                  <span>Smart Analytics</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-sm font-medium">
                  <Trophy className="h-4 w-4 text-zinc-400" />
                  <span>Achievements</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-zinc-400" />
                  <span>Calendar View</span>
                </div>
              </div>

              {/* CTA Buttons - Clean neutral style */}
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="group h-14 px-10 bg-white text-zinc-900 hover:bg-zinc-100 text-lg font-bold shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-10 border-zinc-700 bg-zinc-900/50 backdrop-blur-sm text-white hover:bg-zinc-800 hover:border-zinc-600 text-lg font-medium transition-all duration-300 hover:scale-105 rounded-xl"
                  >
                    <Zap className="mr-2 h-5 w-5 text-zinc-400" />
                    See Demo
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                  <span>100% Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                  <span>Setup in 30 Seconds</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-16 border-y border-zinc-800/50 bg-zinc-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300">10K+</div>
                <div className="mt-1 text-sm text-zinc-500">Active Users</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300">500K+</div>
                <div className="mt-1 text-sm text-zinc-500">Habits Tracked</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300">1M+</div>
                <div className="mt-1 text-sm text-zinc-500">Streaks Built</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-1">
                  4.9 <Star className="h-5 w-5 text-zinc-400 fill-zinc-400" />
                </div>
                <div className="mt-1 text-sm text-zinc-500">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features Section */}
        <section id="features" className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-transparent to-zinc-900/30" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-400 mb-6">
                <Zap className="h-4 w-4" />
                Features
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white">
                Everything You Need
              </h2>
              <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
                Simple yet powerful tools to help you build lasting habits
              </p>
            </div>

            {/* Animated Bento Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-[200px] lg:auto-rows-[220px]">
              {/* Feature 1 - Large */}
              <div className="group relative rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-900/50 md:col-span-2 md:row-span-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-zinc-800/30 rounded-full blur-3xl group-hover:bg-zinc-700/30 transition-colors duration-500" />
                <div className="relative h-full flex flex-col">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-6 w-6 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Smart Habit Tracking</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                    Create unlimited habits with flexible goals. Track binary completions, durations, or quantities - whatever fits your lifestyle.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-900/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full flex flex-col">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-6 w-6 text-zinc-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Clean Analytics</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                    Beautiful charts that reveal patterns in your behavior.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-900/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full flex flex-col">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 group-hover:scale-110 transition-transform duration-300">
                    <Flame className="h-6 w-6 text-zinc-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Streak Motivation</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                    Watch your streaks grow and stay motivated every day.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="group relative rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-900/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full flex flex-col">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-6 w-6 text-zinc-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Calendar Overview</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                    See your consistency at a glance with the calendar view.
                  </p>
                </div>
              </div>

              {/* Feature 5 - Large */}
              <div className="group relative rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-900/50 md:col-span-2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-zinc-800/30 rounded-full blur-3xl group-hover:bg-zinc-700/30 transition-colors duration-500" />
                <div className="relative h-full flex flex-col">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-zinc-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Progress Insights</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                    Weekly and monthly trends help you understand your patterns and optimize your habits for long-term success.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative rounded-2xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm p-6 transition-all duration-500 hover:border-zinc-700 hover:bg-zinc-900/80 hover:-translate-y-1 hover:shadow-2xl hover:shadow-zinc-900/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full flex flex-col">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 group-hover:scale-110 transition-transform duration-300">
                    <Download className="h-6 w-6 text-zinc-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Export Data</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                    Download your habit data as CSV or PDF anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 bg-zinc-900/30 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-400 mb-6">
                <Users className="h-4 w-4" />
                Testimonials
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                Loved by Thousands
              </h2>
            </div>
          </div>

          {/* Marquee Container */}
          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

            {/* First Row - Moving Left */}
            <div className="flex gap-6 mb-6 animate-marquee">
              {/* Row 1 Testimonials */}
              {[
                { name: "Alex K.", text: "Finally a habit tracker that actually motivates me. The streak system is addictive in the best way!", info: "Building 7 habits", initial: "A" },
                { name: "Sarah M.", text: "The analytics are beautiful and actually useful. I can see exactly where I need to improve.", info: "45-day streak 🔥", initial: "S" },
                { name: "James T.", text: "Simple, clean, and effective. This is exactly what I needed to stay consistent.", info: "12 habits tracked", initial: "J" },
                { name: "Priya S.", text: "I&apos;ve tried so many habit apps but this one actually sticks. The design is gorgeous!", info: "30-day streak", initial: "P" },
                { name: "Mike R.", text: "Love the calendar view! Makes it so satisfying to see all my completed habits.", info: "Building 5 habits", initial: "M" },
                { name: "Emma L.", text: "The insights feature helped me realize I&apos;m most productive on Tuesdays. Game changer!", info: "15 habits tracked", initial: "E" },
                // Duplicate for seamless loop
                { name: "Alex K.", text: "Finally a habit tracker that actually motivates me. The streak system is addictive in the best way!", info: "Building 7 habits", initial: "A" },
                { name: "Sarah M.", text: "The analytics are beautiful and actually useful. I can see exactly where I need to improve.", info: "45-day streak 🔥", initial: "S" },
                { name: "James T.", text: "Simple, clean, and effective. This is exactly what I needed to stay consistent.", info: "12 habits tracked", initial: "J" },
              ].map((t, i) => (
                <div key={i} className="flex-shrink-0 w-[350px] rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-zinc-400 fill-zinc-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-4 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-sm">{t.initial}</div>
                    <div>
                      <div className="font-medium text-sm text-white">{t.name}</div>
                      <div className="text-xs text-zinc-500">{t.info}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row - Moving Right */}
            <div className="flex gap-6 animate-marquee-reverse">
              {/* Row 2 Testimonials */}
              {[
                { name: "David H.", text: "Best habit app I&apos;ve ever used. The UI is so clean and the features are exactly what I needed.", info: "60-day streak 🔥", initial: "D" },
                { name: "Nina W.", text: "I love how I can export my data. Finally a company that respects user data ownership!", info: "8 habits tracked", initial: "N" },
                { name: "Chris B.", text: "The dark mode is perfect. I use this app morning and night without eye strain.", info: "Building 10 habits", initial: "C" },
                { name: "Lisa P.", text: "Helped me build a meditation habit after years of trying. The streaks keep me accountable.", info: "90-day streak 🏆", initial: "L" },
                { name: "Tom K.", text: "Finally broke my social media addiction using this. The insights are incredibly helpful.", info: "Breaking 3 bad habits", initial: "T" },
                { name: "Rachel G.", text: "As a busy mom, this app helps me remember self-care habits. Absolute lifesaver!", info: "Building 4 habits", initial: "R" },
                // Duplicate for seamless loop
                { name: "David H.", text: "Best habit app I&apos;ve ever used. The UI is so clean and the features are exactly what I needed.", info: "60-day streak 🔥", initial: "D" },
                { name: "Nina W.", text: "I love how I can export my data. Finally a company that respects user data ownership!", info: "8 habits tracked", initial: "N" },
                { name: "Chris B.", text: "The dark mode is perfect. I use this app morning and night without eye strain.", info: "Building 10 habits", initial: "C" },
              ].map((t, i) => (
                <div key={i} className="flex-shrink-0 w-[350px] rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-zinc-400 fill-zinc-400" />
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-4 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-sm">{t.initial}</div>
                    <div>
                      <div className="font-medium text-sm text-white">{t.name}</div>
                      <div className="text-xs text-zinc-500">{t.info}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Subtle background */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-800/20 rounded-full blur-[150px]" />

          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-400 mb-8">
              <Shield className="h-4 w-4" />
              Start Today
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Ready to Build Better Habits?
            </h2>

            <p className="mt-6 text-lg text-zinc-400 max-w-xl mx-auto">
              Join thousands of people who are already building better habits with HabitCapsule.
              It&apos;s free, simple, and works.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="group h-14 px-10 bg-white text-zinc-900 hover:bg-zinc-100 text-lg font-bold shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                Free forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                Cancel anytime
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
    </>
  );
}
