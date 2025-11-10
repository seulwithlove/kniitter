import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Nav from "./nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kniitter",
  description: "Knit Patterns Reader",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevents pinch zoom for app-like feel
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {/* TODO: next-auth SessionProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen flex-col">
            <header className="sticky top-0 z-50 flex justify-between border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Link
                href="/"
                className="flex items-center font-semibold text-2xl tracking-tight"
              >
                Kniiter
              </Link>
              <Nav />
            </header>
            <main className="flex-1 overflow-auto px-4 py-4">{children}</main>
            <footer className="border-t bg-background py-3 text-center text-sm">
              &#169; seulwithlove 2025
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
