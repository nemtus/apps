"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { ENTRY_START_DATE, DISCORD_URL, TELEGRAM_URL, CONNPASS_URL, IS_HACKATHON_ENDED } from "@/lib/constants"

export function FinalCTA() {
  const { ref, isInView } = useInView()
  const isEntryOpen = new Date() >= ENTRY_START_DATE && !IS_HACKATHON_ENDED

  return (
    <section ref={ref} className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-tertiary/10 opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--glow-secondary),transparent_70%)] opacity-30" />

      <div className="container mx-auto px-6 md:px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="md:text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-gray-300 text-left">
            挑戦する準備は
            <br className="sm:hidden" />
            できていますか？
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed text-pretty text-left">
            あなたのアイデアで、ブロックチェーンの未来を創造しましょう
          </p>

          {isEntryOpen ? (
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary via-secondary to-tertiary hover:shadow-[0_0_50px_var(--glow-primary)] transition-all duration-300 text-foreground border-0 px-8 py-6 text-lg h-auto animate-pulse-slow hover:animate-none hover:scale-105 font-bold"
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
              aria-label={IS_HACKATHON_ENDED ? "エントリーは終了しました" : "エントリーは2025年12月7日から開始されます"}
              className="bg-gradient-to-r from-primary via-secondary to-tertiary opacity-50 cursor-not-allowed text-foreground border-0 px-8 py-6 text-lg h-auto font-bold"
            >
              {IS_HACKATHON_ENDED ? "エントリー終了" : "今すぐエントリー"}
              <ArrowRight className="ml-3" size={24} />
            </Button>
          )}

          {!isEntryOpen && !IS_HACKATHON_ENDED && (
            <p className="text-sm text-muted-foreground mt-4">※ エントリー受付は2025年12月7日開始予定です</p>
          )}

          {IS_HACKATHON_ENDED && (
            <p className="text-sm text-muted-foreground mt-4">※ エントリー受付は終了しました</p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 space-y-6"
          >
            <div className="space-y-4">
              <div className="text-base text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
                <p className="font-semibold text-white mb-2">コミュニティ参加</p>
                <p>各種イベントや重要な連絡を行います。</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="flex-1 border-primary/70 text-primary hover:bg-primary/10 bg-transparent text-sm"
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
                  className="flex-1 border-secondary/70 text-secondary hover:bg-secondary/10 bg-transparent text-sm"
                >
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                    Telegram
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground/80 text-center leading-relaxed max-w-2xl mx-auto">
                ※Webブラウザからの場合、Brave以外のブラウザでTelegramにログインしてからアクセスするとスムーズです。
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/30">
              <div className="text-base text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
                <p className="font-semibold text-white mb-2">イベント申込</p>
                <p>ハッカソン期間中の各種イベント（キックオフ、合宿、ピッチなど）への申込はこちら</p>
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

            <p className="text-center text-sm text-muted-foreground mt-6 pt-4">
              <a href="#flow" className="hover:text-primary transition-colors underline">
                参加の流れをもう一度確認する
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
