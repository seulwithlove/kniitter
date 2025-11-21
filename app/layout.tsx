import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AlerterProvider } from "@/hooks/contexts/alerter";
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
};

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
//   userScalable: false, // Prevents pinch zoom for app-like feel
// };

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
          <AlerterProvider>
            <div className="flex h-screen flex-col">
              <header className="sticky top-0 z-50 flex justify-between border-black/5 border-b bg-background px-6 py-4 backdrop-blur-sm supports-[backdrop-filter]:bg-background/95 dark:border-white/5">
                <Link
                  href="/"
                  className="flex items-center truncate font-light text-3xl tracking-tight transition-opacity hover:opacity-70"
                >
                  kniitter
                </Link>
                <Nav />
              </header>
              <main className="flex-1 px-4 py-6">{children}</main>
              <footer className="border-black/5 border-t bg-background py-4 text-center text-muted-foreground text-xs dark:border-white/5">
                &#169; slo 2025
              </footer>
            </div>
            <Toaster />
          </AlerterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
