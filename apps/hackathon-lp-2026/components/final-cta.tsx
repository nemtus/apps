"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import {
  ENTRY_START_DATE,
  DISCORD_URL,
  TELEGRAM_URL,
  CONNPASS_URL,
  IS_HACKATHON_ENDED,
} from "@/lib/constants"

export function FinalCTA() {
  const { ref, isInView } = useInView()
  const isEntryOpen = new Date() >= ENTRY_START_DATE && !IS_HACKATHON_ENDED

  return (
    <section ref={ref} className="relative overflow-hidden py-12 md:py-20">
      <div className="from-primary/10 via-secondary/10 to-tertiary/10 absolute inset-0 bg-gradient-to-br opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--glow-secondary),transparent_70%)] opacity-30" />

      <div className="relative z-10 container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl md:text-center"
        >
          <h2 className="mb-8 text-left text-3xl font-bold text-gray-300 md:text-5xl">
            挑戦する準備は
            <br className="sm:hidden" />
            できていますか？
          </h2>

          <p className="text-muted-foreground mb-12 text-left text-lg leading-relaxed text-pretty md:text-xl">
            あなたのアイデアで、ブロックチェーンの未来を創造しましょう
          </p>

          {isEntryOpen ? (
            <Button
              asChild
              size="lg"
              className="from-primary via-secondary to-tertiary text-foreground animate-pulse-slow h-auto border-0 bg-gradient-to-r px-8 py-6 text-lg font-bold transition-all duration-300 hover:scale-105 hover:animate-none hover:shadow-[0_0_50px_var(--glow-primary)]"
            >
              <a href="#entry">
                今すぐエントリー
                <ArrowRight className="ml-3" size={24} />
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
              className="from-primary via-secondary to-tertiary text-foreground h-auto cursor-not-allowed border-0 bg-gradient-to-r px-8 py-6 text-lg font-bold opacity-50"
            >
              {IS_HACKATHON_ENDED ? "エントリー終了" : "今すぐエントリー"}
              <ArrowRight className="ml-3" size={24} />
            </Button>
          )}

          {!isEntryOpen && !IS_HACKATHON_ENDED && (
            <p className="text-muted-foreground mt-4 text-sm">
              ※ エントリー受付は2025年12月7日開始予定です
            </p>
          )}

          {IS_HACKATHON_ENDED && (
            <p className="text-muted-foreground mt-4 text-sm">※ エントリー受付は終了しました</p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 space-y-6"
          >
            <div className="space-y-4">
              <div className="text-muted-foreground mx-auto max-w-2xl text-center text-base leading-relaxed">
                <p className="mb-2 font-semibold text-white">コミュニティ参加</p>
                <p>各種イベントや重要な連絡を行います。</p>
              </div>

              <div className="mx-auto flex max-w-xl flex-col justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="border-primary/70 text-primary hover:bg-primary/10 flex-1 bg-transparent text-sm"
                >
                  <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                    Discord
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="border-secondary/70 text-secondary hover:bg-secondary/10 flex-1 bg-transparent text-sm"
                >
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                    Telegram
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </Button>
              </div>

              <p className="text-muted-foreground/80 mx-auto max-w-2xl text-center text-xs leading-relaxed">
                ※Webブラウザからの場合、Brave以外のブラウザでTelegramにログインしてからアクセスするとスムーズです。
              </p>
            </div>

            <div className="border-border/30 space-y-4 border-t pt-4">
              <div className="text-muted-foreground mx-auto max-w-2xl text-center text-base leading-relaxed">
                <p className="mb-2 font-semibold text-white">イベント申込</p>
                <p>
                  ハッカソン期間中の各種イベント（キックオフ、合宿、ピッチなど）への申込はこちら
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="border-muted/70 text-muted-foreground hover:bg-muted/10 bg-transparent text-sm"
                >
                  <a href={CONNPASS_URL} target="_blank" rel="noopener noreferrer">
                    Connpass
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mt-6 pt-4 text-center text-sm">
              <a href="#flow" className="hover:text-primary underline transition-colors">
                参加の流れをもう一度確認する
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
