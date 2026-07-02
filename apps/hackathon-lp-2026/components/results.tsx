"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, FileSpreadsheet, ExternalLink } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const RESULTS = [
  {
    icon: Trophy,
    title: "結果発表記事",
    description: "HACK+ 2026の受賞作品と審査結果をご覧いただけます。",
    url: "https://nemtus.com/nemtus-hackathon-hack-plus-2026-report/",
    buttonText: "結果を見る",
  },
  {
    icon: FileSpreadsheet,
    title: "全提出作品・審査内容",
    description: "全ての提出作品と詳細な審査内容をスプレッドシートで公開しています。",
    url: "https://docs.google.com/spreadsheets/d/1QDRyg5iUozVdtA0TEDdgh1rLkJClCCCnKfmNt2t92-M/",
    buttonText: "スプレッドシートを見る",
  },
]

export function Results() {
  const { ref, isInView } = useInView({ amount: 0.3 })

  return (
    <section id="results" className="py-12 md:py-16 relative" ref={ref}>
      <div className="container mx-auto px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-300">結果発表</h2>
          <p className="text-gray-400">HACK+ 2026は終了しました。ご参加ありがとうございました。</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {RESULTS.map((result, index) => (
            <motion.div
              key={result.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
              className="relative w-full"
            >
              <Card className="relative bg-card-hover border-border hover:border-primary/50 transition-all duration-300 p-6 h-full group flex flex-col w-full">
                <motion.div
                  className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 10, transition: { duration: 0.4, ease: "easeInOut" } }}
                >
                  <result.icon size={28} className="text-primary" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-foreground text-left">{result.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 text-left">
                  {result.description}
                </p>

                <div className="mt-auto">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white w-full"
                  >
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      {result.buttonText}
                      <ExternalLink className="ml-2" size={16} />
                    </a>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
