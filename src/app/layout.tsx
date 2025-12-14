import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/providers/convex-provider";


const googleSans = localFont({
  src: [
    {
      path: "./fonts/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/GoogleSans-Italic.ttf",
      weight: "400",
      style: "italic"
    },
    {
      path: "./fonts/GoogleSans-Medium.ttf",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/GoogleSans-MediumItalic.ttf",
      weight: "500",
      style: "italic"
    },
    {
      path: "./fonts/GoogleSans-SemiBold.ttf",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/GoogleSans-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic"
    },
    {
      path: "./fonts/GoogleSans-Bold.ttf",
      weight: "700",
      style: "normal"
    },
    {
      path: "./fonts/GoogleSans-BoldItalic.ttf",
      weight: "700",
      style: "italic"
    }
  ]
})


// SEO Configuration
const siteConfig = {
  name: "HabitCapsule",
  description: "Build better habits with HabitCapsule - the free habit tracker app. Track daily habits, build streaks, visualize progress with beautiful analytics, and transform your life one habit at a time.",
  url: "https://habitcapsule.app", // Update with your actual domain
  ogImage: "/og-image.png", // Create and add this image
  keywords: [
    "habit tracker",
    "habit tracking app",
    "habit capsule",
    "habitcapsule",
    "daily habit tracker",
    "free habit tracker",
    "habit building app",
    "streak tracker",
    "habit analytics",
    "productivity app",
    "self improvement app",
    "goal tracker",
    "routine tracker",
    "habit journal",
    "morning routine tracker",
    "wellness tracker",
    "personal development",
    "habit formation",
    "build better habits",
    "track habits online",
    "habit monitoring",
    "daily routine app",
    "consistency tracker",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "HabitCapsule - Free Habit Tracker App | Build Better Habits",
    template: "%s | HabitCapsule",
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: "HabitCapsule Team" }],
  creator: "HabitCapsule",
  publisher: "HabitCapsule",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "HabitCapsule - Free Habit Tracker App | Build Better Habits",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "HabitCapsule - Build Better Habits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HabitCapsule - Free Habit Tracker App",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@habitcapsule", // Update with your Twitter handle
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "Productivity",
  verification: {
    // Add your verification codes when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  other: {
    "application-name": "HabitCapsule",
    "apple-mobile-web-app-title": "HabitCapsule",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#18181b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${googleSans.className} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange={false}
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}