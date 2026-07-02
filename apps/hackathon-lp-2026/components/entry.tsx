"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import {
  ENTRY_URL,
  ENTRY_START_DATE,
  SUBMIT_PDF_URL,
  RULES_PDF_URL,
  DISCORD_URL,
  TELEGRAM_URL,
  CONNPASS_URL,
  IS_HACKATHON_ENDED,
} from "@/lib/constants"

export function Entry() {
  const { ref, isInView } = useInView()
  const isEntryOpen = new Date() >= ENTRY_START_DATE
  const isDocumentsPublished = true
  const isRulesPublished = true

  return (
    <section id="entry" ref={ref} className="py-8 md:py-12 relative">
      <div className="container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center text-gray-300">エントリー＆コミュニティ</h2>

          <Card className="relative bg-card-hover border-border hover:border-primary/50 transition-all duration-300 p-4 md:p-6 overflow-hidden group hover:scale-105">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 text-foreground text-left">エントリー・応募方法</h3>
              <p className="text-base md:text-lg text-muted-foreground mb-4 leading-normal text-pretty">
                エントリー・作品提出はAKINDOから行います。
                <span className="inline-block">下記のボタンからアクセスし、必要事項をご確認ください。</span>
              </p>

              <div className="flex flex-col md:flex-row gap-4">
                {isEntryOpen && !IS_HACKATHON_ENDED ? (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_var(--glow-primary)] transition-shadow duration-300 text-foreground border-0 flex-1"
                    >
                      <a href={ENTRY_URL} target="_blank" rel="noopener noreferrer">
                        エントリー・作品提出
                        <ExternalLink className="ml-2" size={18} />
                      </a>
                    </Button>

                    {isDocumentsPublished ? (
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-secondary text-secondary hover:bg-secondary/10 flex-1 bg-transparent"
                      >
                        <a href={SUBMIT_PDF_URL} target="_blank" rel="noopener noreferrer">
                          応募作品提出方法（PDF）
                          <ExternalLink className="ml-2" size={18} />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        disabled
                        variant="outline"
                        className="border-secondary text-secondary opacity-50 cursor-not-allowed flex-1 bg-transparent"
                      >
                        応募作品提出方法（PDF）
                        <ExternalLink className="ml-2" size={18} />
                      </Button>
                    )}

                    {isRulesPublished ? (
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-muted text-muted-foreground hover:bg-muted/10 flex-1 bg-transparent"
                      >
                        <a href={RULES_PDF_URL} target="_blank" rel="noopener noreferrer">
                          参加規約（PDF）
                          <ExternalLink className="ml-2" size={18} />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        disabled
                        variant="outline"
                        className="border-muted text-muted-foreground opacity-50 cursor-not-allowed flex-1 bg-transparent"
                      >
                        参加規約（PDF）
                        <ExternalLink className="ml-2" size={18} />
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      disabled
                      className="bg-gradient-to-r from-primary to-secondary opacity-50 cursor-not-allowed text-foreground border-0 flex-1"
                    >
                      エントリー・作品提出
                      <ExternalLink className="ml-2" size={18} />
                    </Button>

                    <Button
                      size="lg"
                      disabled
                      variant="outline"
                      className="border-secondary text-secondary opacity-50 cursor-not-allowed flex-1 bg-transparent"
                    >
                      応募作品提出方法（PDF）
                      <ExternalLink className="ml-2" size={18} />
                    </Button>

                    {isRulesPublished ? (
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-muted text-muted-foreground hover:bg-muted/10 flex-1 bg-transparent"
                      >
                        <a href={RULES_PDF_URL} target="_blank" rel="noopener noreferrer">
                          参加規約（PDF）
                          <ExternalLink className="ml-2" size={18} />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        disabled
                        variant="outline"
                        className="border-muted text-muted-foreground opacity-50 cursor-not-allowed flex-1 bg-transparent"
                      >
                        参加規約（PDF）
                        <ExternalLink className="ml-2" size={18} />
                      </Button>
                    )}
                  </>
                )}
              </div>

              {IS_HACKATHON_ENDED && (
                <div className="text-sm text-muted-foreground mt-4 text-left space-y-1">
                  <p>※ エントリー受付は終了しました</p>
                </div>
              )}
              {!isEntryOpen && !IS_HACKATHON_ENDED && (
                <div className="text-sm text-muted-foreground mt-4 text-left space-y-1">
                  <p>※ エントリー・作品提出はAKINDOから行います（2025年12月7日 0:00 JST 開始予定）</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-xl font-bold mb-3 text-foreground text-left">2. コミュニティ参加</h3>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 border-muted text-muted-foreground hover:bg-muted/50 bg-transparent text-sm"
                >
                  <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                    Discord
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 border-muted text-muted-foreground hover:bg-muted/50 bg-transparent text-sm"
                >
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                    Telegram
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="flex-1 border-muted text-muted-foreground hover:bg-muted/50 bg-transparent text-sm"
                >
                  <a href={CONNPASS_URL} target="_blank" rel="noopener noreferrer">
                    Connpass
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </Button>
              </div>

              <div className="text-sm text-muted-foreground text-left space-y-3">
                <div>
                  <p className="font-bold text-foreground mb-1">Discord/Telegram:</p>
                  <p>各種イベントや重要な連絡を行います。</p>
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Connpass:</p>
                  <p>ハッカソン期間中の各種イベント（キックオフ、合宿、ピッチなど）の詳細確認・申込ができます。</p>
                </div>
                <p className="text-xs text-center mt-3">
                  ※Webブラウザからの場合、Brave以外のブラウザでTelegramにログインしてからアクセスするとスムーズです。
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
