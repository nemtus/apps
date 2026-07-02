"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import React from "react"
import { ENTRY_START_DATE, ENTRY_END_DATE, IS_HACKATHON_ENDED } from "@/lib/constants"

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}

export function Hero() {
  const now = new Date()
  const isEntryOpen = now >= ENTRY_START_DATE && !IS_HACKATHON_ENDED
  const targetDate = isEntryOpen ? ENTRY_END_DATE : ENTRY_START_DATE
  const countdown = useCountdown(targetDate)

  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="from-primary/10 via-secondary/5 to-tertiary/10 absolute inset-0 bg-gradient-to-br opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--glow-primary),transparent_50%)] opacity-20" />

      <div className="relative z-10 container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateZ: -10, y: -50 }}
            animate={{ scale: 1, opacity: 1, rotateZ: 0, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 1.0,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="mb-6 flex justify-center"
          >
            <motion.div
              className="flex h-32 items-center justify-center md:h-[250px]"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.4 },
              }}
            >
              <Image
                src="/logo-hacktus-2026.png"
                alt="NEMTUS Hackathon 2026 Logo"
                width={200}
                height={200}
                className="h-full w-auto object-contain"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="text-muted-foreground mb-6 px-4 text-xs leading-relaxed break-words md:px-0 md:text-base"
            style={{ wordBreak: "keep-all", overflowWrap: "break-word" }}
          >
            <span className="inline-block">Connect Beyond Blocks —</span>
            <br />
            <span className="inline-block">ブロックチェーン×クリエイティブ</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-foreground/90 mb-6 flex flex-wrap items-center justify-center gap-2 text-xs md:gap-4 md:text-sm"
          >
            <span>総額 6,000 USDC の賞金</span>
            <span className="text-muted-foreground">•</span>
            <span>NEM/Symbol + マルチチェーン</span>
            <span className="text-muted-foreground">•</span>
            <span>初心者歓迎</span>
          </motion.div>

          {IS_HACKATHON_ENDED && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="mb-6 text-center"
            >
              <p className="text-muted-foreground text-sm">エントリー受付は終了しました</p>
            </motion.div>
          )}

          {!IS_HACKATHON_ENDED && !isEntryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="mb-6 text-center"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="text-muted-foreground mb-2 text-xs">エントリー開始まで (JST)</p>
              <div className="flex justify-center gap-2 text-xl font-bold md:gap-3 md:text-2xl">
                <div className="flex flex-col items-center">
                  <span className="text-primary">{countdown.days.toString().padStart(2, "0")}</span>
                  <span className="text-muted-foreground text-[10px]">日</span>
                </div>
                <span className="text-muted-foreground">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-primary">
                    {countdown.hours.toString().padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground text-[10px]">時間</span>
                </div>
                <span className="text-muted-foreground">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-primary">
                    {countdown.minutes.toString().padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground text-[10px]">分</span>
                </div>
                <span className="text-muted-foreground">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-primary">
                    {countdown.seconds.toString().padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground text-[10px]">秒</span>
                </div>
              </div>
            </motion.div>
          )}

          {!IS_HACKATHON_ENDED && isEntryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="mb-6 text-center"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="text-muted-foreground mb-2 text-xs">エントリー終了まで (JST)</p>
              <div className="flex justify-center gap-2 text-xl font-bold md:gap-3 md:text-2xl">
                <div className="flex flex-col items-center">
                  <span className="text-primary">{countdown.days.toString().padStart(2, "0")}</span>
                  <span className="text-muted-foreground text-[10px]">日</span>
                </div>
                <span className="text-muted-foreground">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-primary">
                    {countdown.hours.toString().padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground text-[10px]">時間</span>
                </div>
                <span className="text-muted-foreground">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-primary">
                    {countdown.minutes.toString().padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground text-[10px]">分</span>
                </div>
                <span className="text-muted-foreground">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-primary">
                    {countdown.seconds.toString().padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground text-[10px]">秒</span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center justify-center"
          >
            {isEntryOpen ? (
              <Button
                asChild
                size="lg"
                className="from-primary via-secondary to-tertiary text-foreground animate-pulse-slow w-full border-0 bg-gradient-to-r px-8 py-6 text-lg font-bold transition-all duration-300 hover:scale-105 hover:animate-none hover:shadow-[0_0_40px_var(--glow-primary)] md:w-auto"
              >
                <a href="#entry">
                  今すぐエントリー
                  <ArrowRight className="ml-2" size={24} />
                </a>
              </Button>
            ) : (
              <Button
                size="lg"
                disabled
                aria-label={
                  IS_HACKATHON_ENDED
                    ? "エントリーは終了しました"
                    : "エントリーは2025年12月7日から開始されます"
                }
                className="from-primary via-secondary to-tertiary text-foreground w-full cursor-not-allowed border-0 bg-gradient-to-r px-8 py-6 text-lg font-bold opacity-50 md:w-auto"
              >
                {IS_HACKATHON_ENDED ? "エントリー終了" : "今すぐエントリー"}
                <ArrowRight className="ml-2" size={24} />
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
