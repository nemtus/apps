"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Lightbulb, Sparkles } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const THEMES = [
  {
    themeNumber: "テーマ１",
    title: "Free",
    subtitle: "自分の好きなことや違和感を解放せよ", // 誤字修正：「自分の好きなや違和感」→「自分の好きなことや違和感」
    description:
      "ルールが整備され業界としての習熟が進んだとしても、ブロックチェーンの根幹にはどこまでも自律や自由があり、それが魅力です。\n\nこのテーマでは、業種・業態・形態を問いません。\n\n自身の欲求・愛・違和感・疑問を解放し、自由に生きるとは何かを、あなたらしいプロダクトとして昇華してください。",
    icon: Lightbulb,
  },
  {
    themeNumber: "テーマ２",
    title: "ネタ駆動開発(NDD)",
    subtitle: "NDD / Neta-Driven Development",
    description:
      "社会課題解決、業務効率化――それも大事。けれど、笑いと遊びの中にこそ創造の原点があるとも思えます。\n\n「ネタ駆動開発（NDD）」は、真面目にふざけるテック部門です。\n\n思わずクスッとする発想、誰かに話したくなるアイデア、「そんなの誰が使うんだよ」と言われるようなネタ。\n\n真剣な技術と馬鹿げた発想の化学反応から、思いがけない次の技術潮流が生まれるかもしれません。",
    icon: Sparkles,
  },
]

export function Themes() {
  const { ref, isInView } = useInView()

  return (
    <section id="themes" ref={ref} className="relative py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-300 md:text-5xl">
            Hackathon 2026 テーマ
          </h2>
          <p className="mb-12 px-6 text-left text-sm text-gray-400 md:px-0 md:text-center">
            次の2種類のテーマを設定。興味のあるテーマを選択してください。
            <br className="md:hidden" />
            ※両方に挑戦することも可能です
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {THEMES.map((theme, index) => (
            <motion.div
              key={theme.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="h-full border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/20 md:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-purple-500/30 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-purple-600/20">
                    <theme.icon size={24} className="text-purple-400" />
                  </div>
                  <span className="text-lg font-bold text-gray-300">{theme.themeNumber}</span>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-200">{theme.title}</h3>
                <p className="mb-4 text-sm font-semibold text-gray-300 md:text-base">
                  {theme.subtitle}
                </p>
                <p className="text-sm leading-normal whitespace-pre-line text-gray-400">
                  {theme.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
