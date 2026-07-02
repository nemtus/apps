"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  MapPin,
  Lightbulb,
  Users,
  Handshake,
  GraduationCap,
  ExternalLink,
} from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { ARCHIVE_URL } from "@/lib/constants"

const HIGHLIGHTS = [
  {
    icon: Calendar,
    title: "継続開催",
    description: "2022年より毎年開催される信頼のイベント",
  },
  {
    icon: MapPin,
    title: "マルチロケーション",
    description: "東京・京都・オンラインで世界から参加可能",
  },
  {
    icon: Lightbulb,
    title: "2つのテーマ",
    description: "フリー＆ネタ駆動開発(NDD)で多様な挑戦",
  },
  {
    icon: Users,
    title: "チームエントリー",
    description: "グループでも1人でも。キックオフミーティングで仲間を見つけるのもアリ！",
  },
  {
    icon: Handshake,
    title: "スポンサー共創",
    description: "企業との協業チャンスが生まれる",
  },
  {
    icon: GraduationCap,
    title: "学びの場",
    description: "合宿参加で技術交流とスキルアップの機会も！",
  },
]

export function Highlights() {
  const { ref, isInView } = useInView({ amount: 1.0 })

  return (
    <section id="highlights" className="relative py-12 md:py-20" ref={ref}>
      <div className="container mx-auto overflow-hidden px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-300 md:text-5xl">ハイライト</h2>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 80, scale: 0.8, rotateY: -20, filter: "blur(10px)" }}
              animate={
                isInView ? { opacity: 1, y: 0, scale: 1, rotateY: 0, filter: "blur(0px)" } : {}
              }
              transition={{ duration: 1.0, delay: 0.3 + index * 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className="relative w-full"
            >
              <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div
                  className="from-primary via-secondary to-tertiary animate-gradient-flow absolute inset-0 rounded-lg bg-gradient-to-r bg-[length:200%_100%]"
                  style={{
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: "1px",
                  }}
                />
              </div>

              <Card className="bg-card-hover border-border group relative flex h-full w-full flex-col p-6 transition-all duration-300 hover:border-transparent">
                <motion.div
                  className="from-primary/20 to-secondary/20 mb-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br transition-transform duration-300 group-hover:scale-110"
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.6, ease: "easeInOut" },
                  }}
                >
                  <highlight.icon size={24} className="text-primary" />
                </motion.div>
                <h3 className="text-foreground mb-2 text-left text-xl font-bold">
                  {highlight.title}
                </h3>
                <p className="text-muted-foreground mb-4 text-left text-sm leading-relaxed text-pretty break-words">
                  {highlight.description}
                </p>

                {index === 0 && (
                  <div className="mt-auto">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10 w-full bg-transparent"
                    >
                      <a href={ARCHIVE_URL} target="_blank" rel="noopener noreferrer">
                        過去のHACK＋
                        <ExternalLink className="ml-2" size={16} />
                      </a>
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
