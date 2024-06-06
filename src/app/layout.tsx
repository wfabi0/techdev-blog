import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Tech Dev Insights",
  description: "Website about tech development insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("antialiased", inter.className)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            // disableTransitionOnChange
          >
            <Navbar />
            <Suspense fallback={<Loading />}>{children}</Suspense>
            <Footer />
            <Toaster richColors closeButton />
          </ThemeProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
