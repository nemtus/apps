"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ExternalLink } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const SCHEDULE_ITEMS = [
  {
    title: "キックオフイベント",
    date: "2025年12月07日(日) 14:00-17:00 (JST)",
    location: "プリザンターラウンジ＠東京 / progate＠京都 / オンライン",
    connpassUrl: "https://nemtus.connpass.com/event/375001/",
    active: true,
  },
  {
    title: "エントリー期間 (※1)",
    date: "2025年12月07日(日) 0:00 ～ 2026年3月15日(日) 23:59 (JST)",
    location: "オンライン",
  },
  {
    title: "ハッカソン開発合宿1 東京合宿",
    date: "2026年1月17日(土)～1月18日(日) (JST)",
    location: "東京",
    connpassUrl: "https://nemtus.connpass.com/event/378247/",
    active: true,
  },
  {
    title: "ハッカソン開発合宿2 京都合宿",
    date: "2026年2月21日(土)～2月22日(日) (JST)",
    location: "京都",
    connpassUrl: "https://nemtus.connpass.com/event/378251/",
    active: true,
  },
  {
    title: "成果提出期限 (※2)",
    date: "2026年3月15日(日) 23:59 (JST)",
    location: "オンライン",
  },
  {
    title: "審査期間",
    date: "2026年3月16日(月)～2026年3月22日(日) (JST)",
    location: "オンライン",
  },
  {
    title: "ピッチイベント・結果発表・授賞式 (※3)",
    date: "2026年3月22日(日) 10:30-18:00 (JST)",
    location: "プリザンターラウンジ＠東京 / progate＠京都 / オンライン",
    connpassUrl: "https://nemtus.connpass.com/event/378980/",
    active: true,
  },
]

export function Schedule() {
  const { ref, isInView } = useInView()

  return (
    <section id="schedule" ref={ref} className="py-12 md:py-20 relative">
      <div className="container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-300">スケジュール</h2>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {SCHEDULE_ITEMS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-card-hover border-border hover:border-primary/30 transition-all duration-300 p-6 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex flex-col pl-4 min-h-[120px]">
                  <div className="flex-1 text-left mb-4">
                    <h3 className="text-lg md:text-xl font-bold mb-3 text-foreground text-pretty">{item.title}</h3>
                    <div className="flex flex-col sm:flex-row gap-4 text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <Calendar size={18} className="text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-pretty">{item.date}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-pretty">{item.location}</span>
                      </div>
                    </div>
                  </div>
                  {item.connpassUrl !== undefined && (
                    <div className="flex justify-end mt-auto">
                      {item.active ? (
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-muted text-muted-foreground hover:bg-muted/50 bg-transparent h-auto py-1.5 text-xs px-3"
                        >
                          <a href={item.connpassUrl!} target="_blank" rel="noopener noreferrer">
                            イベント詳細・申込
                            <ExternalLink className="ml-1.5" size={14} />
                          </a>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="border-muted text-muted-foreground/40 bg-transparent opacity-40 cursor-not-allowed h-auto py-1.5 text-xs px-3"
                        >
                          イベント詳細・申込
                          <ExternalLink className="ml-1.5" size={14} />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 max-w-4xl mx-auto"
        >
          <Card className="bg-muted/20 border-muted/30 p-6">
            <p className="text-sm text-muted-foreground leading-relaxed text-left text-pretty">
              <strong className="text-foreground">ハッカソン参加要件：</strong>
              (※1),(※2)のオンライン申込および(※3)で参加方法はオフライン・オンラインを選択可能。事前提出物審査とは別の加点機会です。※不参加であっても失格にはなりません。
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
