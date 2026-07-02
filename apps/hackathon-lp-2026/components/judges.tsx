"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MessageSquare } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const JUDGES = [
  {
    name: "Daoka",
    roleLines: ["The Symbol Syndicate", "@DaokaTrade"],
    image: "/images/Daoka.png",
    link: "https://x.com/DaokaTrade?s=20",
  },
  {
    name: "Jaguar",
    roleLines: ["The Symbol Syndicate", "NEM/Symbol Core Developer"],
    image: "/Jaguar.png",
    link: "https://x.com/Jaguar0625",
  },
  {
    name: "後藤博之【ごっつ】",
    roleLines: ["NPO法人NEMTUS理事長", "Atomos-Seed代表", "フードNFTコンソーシアム共同会長"],
    image: "/goto.png",
    link: "https://x.com/h_gocchi",
  },
  {
    name: "高橋ピョン太",
    roleLines: ["ZEN大学コンテンツ産業史", "アーカイブセンター 研究員", "フリーライター"],
    image: "/takahashi.png",
    link: "https://x.com/pyonta",
  },
  {
    name: "倉持健史【tksarah】",
    roleLines: ["Astar Community Council Member"],
    image: "/kuramochi.png",
    link: "https://x.com/tsarah0822",
  },
  {
    name: "早川裕太",
    roleLines: ["株式会社WAVEE 代表取締役"],
    image: "/hayakawa_profile.png",
    link: "https://x.com/yi_hayakawa",
  },
  {
    name: "みずき",
    roleLines: ["株式会社ネクストラボ　代表取締役"],
    image: "/mizuki.jpg",
    link: "https://www.instagram.com/mizuki.1992",
  },
]

export function Judges() {
  const { ref, isInView } = useInView({ amount: 1.0 })

  return (
    <section id="judges" ref={ref} className="relative py-12 md:py-20">
      <div className="container mx-auto overflow-hidden px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-300 md:text-5xl">審査員</h2>
        </motion.div>

        <div className="mx-auto mb-24 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {JUDGES.map((judge, index) => (
            <motion.div
              key={judge.name}
              initial={{ opacity: 0, scale: 0.7, y: 60, rotateZ: -10, filter: "blur(10px)" }}
              animate={
                isInView ? { opacity: 1, scale: 1, y: 0, rotateZ: 0, filter: "blur(0px)" } : {}
              }
              transition={{
                duration: 1.0,
                delay: 0.3 + index * 0.22,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.4 },
              }}
              className="relative w-full"
            >
              <a
                href={judge.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block"
              >
                <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div
                    className="from-primary via-secondary to-tertiary animate-gradient-flow absolute inset-0 rounded-lg bg-gradient-to-r bg-[length:200%_100%]"
                    style={{
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      padding: "1px",
                    }}
                  />
                </div>

                <Card className="bg-card-hover border-border group relative flex h-[360px] w-full cursor-pointer flex-col overflow-hidden p-6 transition-all duration-300 hover:border-transparent">
                  <motion.div
                    className={`mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-2 ${
                      index < 3
                        ? "border-secondary/30 group-hover:border-secondary"
                        : "border-primary/30 group-hover:border-primary"
                    } relative z-10 flex-shrink-0 transition-colors duration-300`}
                    whileHover={{
                      scale: 1.15,
                      rotate: 5,
                      transition: { duration: 0.4 },
                    }}
                  >
                    <img
                      src={judge.image || "/placeholder.svg"}
                      alt={judge.name}
                      className={`h-full w-full object-cover ${judge.image === "/images/Daoka.png" ? "grayscale" : ""}`}
                    />
                  </motion.div>
                  <div className="relative z-10 flex flex-1 flex-col justify-center">
                    <h3 className="text-foreground mb-3 text-left text-xl font-bold break-words">
                      {judge.name}
                    </h3>
                    <div className="text-muted-foreground space-y-1 text-left text-sm">
                      {judge.roleLines.map((line, lineIndex) => (
                        <p key={lineIndex} className="break-words">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </Card>
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9, filter: "blur(10px)" }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.0, delay: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-300 md:text-5xl">コミュニティ評価</h2>
          </div>

          <Card className="bg-card-hover border-border p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start">
              <div className="from-secondary/20 to-tertiary/20 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
                <Star size={24} className="text-secondary" />
              </div>
              <div className="text-left">
                <p className="text-muted-foreground mb-4 text-base leading-relaxed text-pretty md:text-lg">
                  審査員に加え、コミュニティによる評価(スター/コメント)を受け付けます。
                </p>
                <p className="text-muted-foreground text-sm text-pretty md:text-base">
                  <strong className="text-success">審査・評価受付期間：</strong>
                  2026年3月16日(月)～2026年3月22日(日)
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="https://docs.google.com/forms/d/15SkW0b36opN1T5eCBkxNTbfGiRs3LgaNleQ9_6mW-5o/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  className="border-tertiary text-tertiary hover:bg-tertiary/10 w-full bg-transparent"
                  variant="outline"
                  aria-label="コミュニティ評価投票フォーム"
                >
                  <Star className="mr-2" size={18} />
                  コミュニティ投票フォームはこちら
                </Button>
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
