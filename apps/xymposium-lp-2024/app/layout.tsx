import { buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/ui/nav";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Symbol",
  description: "Symbol Community Event",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          "min-h-screen bg-background font-sans antialiased " + inter.variable
        }
      >
        <header className="container z-40 bg-background">
          <div className="flex h-20 items-center justify-between py-6">
            <MainNav
              items={[
                { title: "Programs", href: "/programs" },
                { title: "Terms", href: "/terms" },
                { title: "About", href: "/about" },
                { title: "Contact", href: "/contact" },
              ]}
            />
            <nav>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                Login
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
