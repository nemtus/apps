"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Card } from "@/components/ui/card"

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <section id="about" className="py-8 md:py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--color-primary-rgb),0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--color-secondary-rgb),0.05),transparent_50%)]" />

      <div className="container mx-auto px-6 md:px-12 relative z-10" ref={ref}>
        <motion.h2
          className="text-center mb-12 font-bold"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="block text-2xl md:text-5xl text-white">Re:Free</span>
          <span className="block text-lg md:text-3xl mt-2 text-white">—自由を再定義する—</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-4 text-left text-base px-0 md:px-8">
            <div className="space-y-2">
              <p className="text-gray-300 leading-normal">
                ブロックチェーンが制度の枠組みの中に位置づけられた今、かつて掲げた
                <span className="text-gray-300 font-semibold">"自由"</span>の意味は変わりました。
              </p>
              <p className="text-gray-300 leading-normal">
                世界中で社会実装も進み、多くのプロジェクトが制度の枠組みや実経済の中で動き始めています。
              </p>
            </div>

            <div className="py-3">
              <div className="h-px w-full bg-border" />
            </div>

            <div className="space-y-2">
              <p className="text-gray-300 leading-normal">
                それでも、<span className="text-gray-300 font-semibold">創造の余白</span>はまだ残っている。
              </p>
              <p className="text-gray-300 leading-normal">
                むしろ整った世界だからこそ、その中で
                <span className="text-gray-300 font-semibold">自由を選び取る力</span>が問われる。
              </p>
            </div>

            <div className="py-3">
              <div className="h-px w-full bg-border" />
            </div>

            <div className="space-y-3">
              <p className="text-gray-300 leading-normal">
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
                  HACK+2026 "Re:Free"
                </span>
                は、社会に溶け込みつつあるWeb3の世界で、再び
                <span className="text-gray-300 font-semibold">「自由に創る」</span>とは何かを探るハッカソンです。
              </p>

              <p className="text-gray-300 leading-normal">
                ブロックチェーンを、もう一度<span className="text-gray-300 font-medium">"個人の創造"</span>
                から見つめ直す。
              </p>

              <div className="pt-2">
                <p className="text-gray-300 font-medium leading-normal">
                  それが、2026年に再び<span className="text-gray-300 font-bold">「Free」</span>で開催する理由です。
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <h3 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-300">参加者の声</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-card-hover border-border">
              <p className="text-sm text-gray-400 italic mb-2">
                「初心者でしたが、コミュニティのサポートで完走できました」
              </p>
              <p className="text-xs text-muted-foreground text-right">— 過去参加者</p>
            </Card>
            <Card className="p-4 bg-card-hover border-border">
              <p className="text-sm text-gray-400 italic mb-2">
                「このハッカソンで出会った仲間と、今もプロジェクトを続けています」
              </p>
              <p className="text-xs text-muted-foreground text-right">— 過去参加者</p>
            </Card>
            <Card className="p-4 bg-card-hover border-border">
              <p className="text-sm text-gray-400 italic mb-2">「賞金以上に、技術力が爆上がりしました」</p>
              <p className="text-xs text-muted-foreground text-right">— 過去参加者</p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
