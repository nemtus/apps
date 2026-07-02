"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Card } from "@/components/ui/card"

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <section id="about" className="relative overflow-hidden py-8 md:py-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--color-primary-rgb),0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--color-secondary-rgb),0.05),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-6 md:px-12" ref={ref}>
        <motion.h2
          className="mb-12 text-center font-bold"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="block text-2xl text-white md:text-5xl">Re:Free</span>
          <span className="mt-2 block text-lg text-white md:text-3xl">—自由を再定義する—</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto max-w-4xl"
        >
          <div className="space-y-4 px-0 text-left text-base md:px-8">
            <div className="space-y-2">
              <p className="leading-normal text-gray-300">
                ブロックチェーンが制度の枠組みの中に位置づけられた今、かつて掲げた
                <span className="font-semibold text-gray-300">"自由"</span>の意味は変わりました。
              </p>
              <p className="leading-normal text-gray-300">
                世界中で社会実装も進み、多くのプロジェクトが制度の枠組みや実経済の中で動き始めています。
              </p>
            </div>

            <div className="py-3">
              <div className="bg-border h-px w-full" />
            </div>

            <div className="space-y-2">
              <p className="leading-normal text-gray-300">
                それでも、<span className="font-semibold text-gray-300">創造の余白</span>
                はまだ残っている。
              </p>
              <p className="leading-normal text-gray-300">
                むしろ整った世界だからこそ、その中で
                <span className="font-semibold text-gray-300">自由を選び取る力</span>が問われる。
              </p>
            </div>

            <div className="py-3">
              <div className="bg-border h-px w-full" />
            </div>

            <div className="space-y-3">
              <p className="leading-normal text-gray-300">
                <span className="from-primary via-secondary to-tertiary bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent md:text-xl">
                  HACK+2026 "Re:Free"
                </span>
                は、社会に溶け込みつつあるWeb3の世界で、再び
                <span className="font-semibold text-gray-300">「自由に創る」</span>
                とは何かを探るハッカソンです。
              </p>

              <p className="leading-normal text-gray-300">
                ブロックチェーンを、もう一度
                <span className="font-medium text-gray-300">"個人の創造"</span>
                から見つめ直す。
              </p>

              <div className="pt-2">
                <p className="leading-normal font-medium text-gray-300">
                  それが、2026年に再び<span className="font-bold text-gray-300">「Free」</span>
                  で開催する理由です。
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mt-12 max-w-4xl"
        >
          <h3 className="mb-8 text-center text-xl font-bold text-gray-300 md:text-2xl">
            参加者の声
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-card-hover border-border p-4">
              <p className="mb-2 text-sm text-gray-400 italic">
                「初心者でしたが、コミュニティのサポートで完走できました」
              </p>
              <p className="text-muted-foreground text-right text-xs">— 過去参加者</p>
            </Card>
            <Card className="bg-card-hover border-border p-4">
              <p className="mb-2 text-sm text-gray-400 italic">
                「このハッカソンで出会った仲間と、今もプロジェクトを続けています」
              </p>
              <p className="text-muted-foreground text-right text-xs">— 過去参加者</p>
            </Card>
            <Card className="bg-card-hover border-border p-4">
              <p className="mb-2 text-sm text-gray-400 italic">
                「賞金以上に、技術力が爆上がりしました」
              </p>
              <p className="text-muted-foreground text-right text-xs">— 過去参加者</p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
