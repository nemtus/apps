import { MainNav } from "@/components/ui/nav";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Symbol",
  description: "Symbol Community Event",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={"min-h-screen bg-background font-sans antialiased " + inter.variable}>
        <header
          className="h-20 fixed flex items-center container z-40 bg-background backdrop-blur-sm"
          style={{ background: "hsla(0,0%,100%,.8)" }}
        >
          <MainNav
            items={[
              { title: "Programs", href: "#programs" },
              { title: "Terms", href: "/terms" },
              false ? { title: "Account", href: "/user/mypage" } : { title: "Login", href: "/auth" },
            ]}
          />
        </header>
        {children}
      </body>
    </html>
  );
}
