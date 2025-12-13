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



export const metadata: Metadata = {
  title: "HabitCapsule - Build Better Habits",
  description: "Track your habits, analyze your progress, and build a better you",
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