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
    <section id="flow" ref={ref} className="py-12 md:py-20 relative">
      <div className="container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-300">参加の流れ</h2>

          <div className="flex flex-col md:flex-row gap-4 md:gap-4 max-w-5xl mx-auto md:justify-center">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex md:flex-col items-center md:items-center"
              >
                <div className="flex md:flex-col items-center md:items-center gap-3 md:gap-0 flex-1 md:flex-none md:min-w-[160px]">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-bold md:mb-2">
                    {step.number}
                  </div>
                  <div className="flex flex-col md:items-center flex-1 md:flex-none">
                    <div className="flex items-center gap-1 mb-1">
                      <h3 className="text-sm font-bold text-gray-300 md:text-center">{step.title}</h3>
                      {step.required && (
                        <span className="px-1.5 py-0.5 bg-red-500/80 rounded text-[10px] font-bold whitespace-nowrap text-white">
                          必須
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 md:text-center">{step.date}</p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="text-gray-600 text-2xl md:mx-2 my-2 md:my-0 md:mb-8">
                    <span className="md:hidden">↓</span>
                    <span className="hidden md:inline">→</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6 max-w-3xl mx-auto">
            各ステップの詳細は下記のセクションをご確認ください
          </p>
        </motion.div>
      </div>
    </section>
  )
}
