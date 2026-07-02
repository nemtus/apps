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
    <section id="entry" ref={ref} className="relative py-8 md:py-12">
      <div className="container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl"
        >
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-300 md:text-5xl">
            エントリー＆コミュニティ
          </h2>

          <Card className="bg-card-hover border-border hover:border-primary/50 group relative overflow-hidden p-4 transition-all duration-300 hover:scale-105 md:p-6">
            <div className="mb-6">
              <h3 className="text-foreground mb-3 text-left text-xl font-bold">
                エントリー・応募方法
              </h3>
              <p className="text-muted-foreground mb-4 text-base leading-normal text-pretty md:text-lg">
                エントリー・作品提出はAKINDOから行います。
                <span className="inline-block">
                  下記のボタンからアクセスし、必要事項をご確認ください。
                </span>
              </p>

              <div className="flex flex-col gap-4 md:flex-row">
                {isEntryOpen && !IS_HACKATHON_ENDED ? (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="from-primary to-secondary text-foreground flex-1 border-0 bg-gradient-to-r transition-shadow duration-300 hover:shadow-[0_0_20px_var(--glow-primary)]"
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
                        className="border-secondary text-secondary flex-1 cursor-not-allowed bg-transparent opacity-50"
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
                        className="border-muted text-muted-foreground flex-1 cursor-not-allowed bg-transparent opacity-50"
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
                      className="from-primary to-secondary text-foreground flex-1 cursor-not-allowed border-0 bg-gradient-to-r opacity-50"
                    >
                      エントリー・作品提出
                      <ExternalLink className="ml-2" size={18} />
                    </Button>

                    <Button
                      size="lg"
                      disabled
                      variant="outline"
                      className="border-secondary text-secondary flex-1 cursor-not-allowed bg-transparent opacity-50"
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
                        className="border-muted text-muted-foreground flex-1 cursor-not-allowed bg-transparent opacity-50"
                      >
                        参加規約（PDF）
                        <ExternalLink className="ml-2" size={18} />
                      </Button>
                    )}
                  </>
                )}
              </div>

              {IS_HACKATHON_ENDED && (
                <div className="text-muted-foreground mt-4 space-y-1 text-left text-sm">
                  <p>※ エントリー受付は終了しました</p>
                </div>
              )}
              {!isEntryOpen && !IS_HACKATHON_ENDED && (
                <div className="text-muted-foreground mt-4 space-y-1 text-left text-sm">
                  <p>
                    ※ エントリー・作品提出はAKINDOから行います（2025年12月7日 0:00 JST 開始予定）
                  </p>
                </div>
              )}
            </div>

            <div className="border-border mt-6 border-t pt-6">
              <h3 className="text-foreground mb-3 text-left text-xl font-bold">
                2. コミュニティ参加
              </h3>

              <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-muted text-muted-foreground hover:bg-muted/50 flex-1 bg-transparent text-sm"
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
                  className="border-muted text-muted-foreground hover:bg-muted/50 flex-1 bg-transparent text-sm"
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
                  className="border-muted text-muted-foreground hover:bg-muted/50 flex-1 bg-transparent text-sm"
                >
                  <a href={CONNPASS_URL} target="_blank" rel="noopener noreferrer">
                    Connpass
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </Button>
              </div>

              <div className="text-muted-foreground space-y-3 text-left text-sm">
                <div>
                  <p className="text-foreground mb-1 font-bold">Discord/Telegram:</p>
                  <p>各種イベントや重要な連絡を行います。</p>
                </div>
                <div>
                  <p className="text-foreground mb-1 font-bold">Connpass:</p>
                  <p>
                    ハッカソン期間中の各種イベント（キックオフ、合宿、ピッチなど）の詳細確認・申込ができます。
                  </p>
                </div>
                <p className="mt-3 text-center text-xs">
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
