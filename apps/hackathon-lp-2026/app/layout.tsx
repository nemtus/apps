import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_JP, Orbitron, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "NEMTUS Hackathon 2026 HACK+ Re:Free | Connect Beyond Blocks",
  description:
    "ブロックチェーン×クリエイティブの最前線へ。総額6,000 USDC、2テーマ（Free・ネタ駆動開発）で開催。2025年12月7日(JST)～2026年3月15日(JST)",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/images/logo-hacktus-fabi.png",
        type: "image/png",
      },
    ],
    apple: "/images/logo-hacktus-fabi.png",
  },
  openGraph: {
    title: "NEMTUS Hackathon 2026 HACK+ Re:Free",
    description:
      "Connect Beyond Blocks — ブロックチェーン×クリエイティブの最前線へ。総額6,000 USDC",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${orbitron.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "NEMTUS Hackathon 2026 HACK+ Re:Free",
              description:
                "ブロックチェーン×クリエイティブの最前線へ。総額6,000 USDC、2テーマで開催",
              startDate: "2025-12-07T00:00:00+09:00",
              endDate: "2026-03-15T23:59:00+09:00",
              eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
              location: {
                "@type": "VirtualLocation",
                url: "https://hackathon.nemtus.com",
              },
              organizer: {
                "@type": "Organization",
                name: "NPO法人 NEMTUS",
                url: "https://nemtus.com",
              },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "USDC",
                price: "6000",
                description: "総賞金額",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
