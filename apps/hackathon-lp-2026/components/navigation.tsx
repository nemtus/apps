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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/images/design-mode/logo_hacktus_%EF%BD%82_2026S.png"
            alt="NEMTUS Hackathon Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-bold text-lg hidden sm:inline text-foreground">NEMTUS Hackathon 2026 HACK+</span>
        </div>

        {/* デスクトップナビゲーション */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollToSection(item.href)}
              className={`text-sm transition-colors hover:text-primary relative ${
                activeSection === item.href.slice(1) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
              {activeSection === item.href.slice(1) && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
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
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_var(--glow-primary)] transition-shadow duration-300 text-foreground border-0"
            >
              <a href="#entry">今すぐエントリー</a>
            </Button>
          ) : (
            <Button
              disabled
              aria-label={IS_HACKATHON_ENDED ? "エントリーは終了しました" : "エントリーは2025年12月7日から開始されます"}
              className="bg-gradient-to-r from-primary to-secondary opacity-50 cursor-not-allowed text-foreground border-0"
            >
              {IS_HACKATHON_ENDED ? "エントリー終了" : "今すぐエントリー"}
            </Button>
          )}

          {/* モバイルメニューボタン */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
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
            className="md:hidden bg-background/98 backdrop-blur-md border-t border-border overflow-y-auto max-h-[calc(100vh-80px)]"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-left py-2 transition-colors hover:text-primary ${
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
