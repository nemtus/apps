import { Inter } from "next/font/google";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <body className={"min-h-screen bg-background font-sans antialiased " + inter.variable}>{children}</body>;
}
