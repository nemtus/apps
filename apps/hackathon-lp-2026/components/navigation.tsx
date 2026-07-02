"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ENTRY_START_DATE, IS_HACKATHON_ENDED } from "@/lib/constants"

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "参加の流れ", href: "#flow" },
  { label: "Themes", href: "#themes" },
  { label: "Multi-Chain", href: "#multi-chain" },
  { label: "Prizes", href: "#prizes" },
  { label: "Schedule", href: "#schedule" },
  { label: "Entry", href: "#entry" },
  { label: "Judges", href: "#judges" },
  { label: "Sponsors", href: "#sponsors" },
  { label: "FAQ", href: "#faq" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [isEntryOpen, setIsEntryOpen] = useState(false)

  useEffect(() => {
    setIsEntryOpen(new Date() >= ENTRY_START_DATE && !IS_HACKATHON_ENDED)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // スクロールスパイ
      const sections = NAV_ITEMS.map((item) => item.href.slice(1))
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    // まずメニューを閉じる
    setIsMobileMenuOpen(false)

    // メニューが閉じるアニメーションを待ってからスクロール
    setTimeout(() => {
      const element = document.getElementById(href.slice(1))
      if (element) {
        const headerHeight = 100 // ヘッダーの高さ + マージン
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerHeight

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    }, 300) // アニメーションの時間（300ms）を待つ
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 border-border border-b backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Image
            src="/images/design-mode/logo_hacktus_%EF%BD%82_2026S.png"
            alt="NEMTUS Hackathon Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-foreground hidden text-lg font-bold sm:inline">
            NEMTUS Hackathon 2026 HACK+
          </span>
        </div>

        {/* デスクトップナビゲーション */}
        <div className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className={`hover:text-primary relative text-sm transition-colors ${
                activeSection === item.href.slice(1) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
              {activeSection === item.href.slice(1) && (
                <motion.div
                  layoutId="activeSection"
                  className="bg-primary absolute right-0 -bottom-1 left-0 h-0.5"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isEntryOpen ? (
            <Button
              asChild
              className="from-primary to-secondary text-foreground border-0 bg-gradient-to-r transition-shadow duration-300 hover:shadow-[0_0_20px_var(--glow-primary)]"
            >
              <a href="#entry">今すぐエントリー</a>
            </Button>
          ) : (
            <Button
              disabled
              aria-label={
                IS_HACKATHON_ENDED
                  ? "エントリーは終了しました"
                  : "エントリーは2025年12月7日から開始されます"
              }
              className="from-primary to-secondary text-foreground cursor-not-allowed border-0 bg-gradient-to-r opacity-50"
            >
              {IS_HACKATHON_ENDED ? "エントリー終了" : "今すぐエントリー"}
            </Button>
          )}

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-foreground p-2 md:hidden"
            aria-label="メニュー"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* モバイルメニュー */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-background/98 border-border max-h-[calc(100vh-80px)] overflow-y-auto border-t backdrop-blur-md md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`hover:text-primary py-2 text-left transition-colors ${
                    activeSection === item.href.slice(1) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
