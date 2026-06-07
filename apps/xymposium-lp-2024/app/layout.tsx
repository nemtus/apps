import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Symbol/NEM Community Xymposium",
  description: "Symbol/NEM コミュニティによる Xymposium のサイドイベントを開催致します",
  metadataBase: new URL("https://community-xymposium-2024.nemtus.com/"),
  twitter: {
    card: "summary_large_image",
    title: "Symbol/NEM Community Xymposium",
    description: "Symbol/NEM コミュニティによる Xymposium のサイドイベントを開催致します",
    creator: "@faunsu19000",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={"min-h-screen bg-background font-sans antialiased " + inter.variable}>{children}</body>
    </html>
  );
}
