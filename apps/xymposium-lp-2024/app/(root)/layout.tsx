import { MainNav } from "@/components/ui/nav";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={"min-h-screen bg-background font-sans antialiased " + inter.variable}>
        <header
          className="h-20 fixed flex items-center z-40 bg-background backdrop-blur-sm"
          style={{ background: "hsla(0,0%,100%,.8)" }}
        >
          <MainNav
            items={[
              { title: "Programs", href: "/#programs" },
              { title: "Terms", href: "/terms" },
            ]}
          />
        </header>
        {children}
      </body>
    </html>
  );
}
