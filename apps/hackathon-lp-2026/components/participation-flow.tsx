"use client"

import { motion } from "framer-motion"
import { useInView } from "@/hooks/use-in-view"

const steps = [
  {
    number: "01",
    title: "エントリー",
    date: "12/7 〜 3/15",
    required: true,
  },
  {
    number: "02",
    title: "コミュニティ参加",
    date: "Discord/Telegram",
    required: false,
  },
  {
    number: "03",
    title: "イベント参加",
    date: "12/7, 1/18, 2/22, 3/22",
    required: false,
  },
  {
    number: "04",
    title: "作品提出",
    date: "3/15 締切",
    required: true,
  },
  {
    number: "05",
    title: "ピッチ＆表彰",
    date: "3/22",
    required: true,
  },
]

export function ParticipationFlow() {
  const { ref, isInView } = useInView()

  return (
    <section id="flow" ref={ref} className="relative py-12 md:py-20">
      <div className="container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-300 md:text-5xl">
            参加の流れ
          </h2>

          <div className="mx-auto flex max-w-5xl flex-col gap-4 md:flex-row md:justify-center md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center md:flex-col md:items-center"
              >
                <div className="flex flex-1 items-center gap-3 md:min-w-[160px] md:flex-none md:flex-col md:items-center md:gap-0">
                  <div className="from-primary to-secondary flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r text-sm font-bold md:mb-2">
                    {step.number}
                  </div>
                  <div className="flex flex-1 flex-col md:flex-none md:items-center">
                    <div className="mb-1 flex items-center gap-1">
                      <h3 className="text-sm font-bold text-gray-300 md:text-center">
                        {step.title}
                      </h3>
                      {step.required && (
                        <span className="rounded bg-red-500/80 px-1.5 py-0.5 text-[10px] font-bold whitespace-nowrap text-white">
                          必須
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 md:text-center">{step.date}</p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="my-2 text-2xl text-gray-600 md:mx-2 md:my-0 md:mb-8">
                    <span className="md:hidden">↓</span>
                    <span className="hidden md:inline">→</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-gray-500">
            各ステップの詳細は下記のセクションをご確認ください
          </p>
        </motion.div>
      </div>
    </section>
  )
}
