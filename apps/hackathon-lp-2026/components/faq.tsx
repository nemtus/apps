"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useInView } from "@/hooks/use-in-view"

const FAQ_ITEMS = [
  {
    question: "参加資格はありますか？",
    answer:
      "どなたでも参加可能です。個人・チームどちらでもエントリーできます。プログラミング経験がある方を推奨しますが、初心者の方も歓迎します。",
  },
  {
    question: "チーム編成について教えてください",
    answer:
      "個人またはチームでの参加が可能です。チームメンバーは開催期間中に変更することもできます。",
  },
  {
    question: "提出物は何が必要ですか？",
    answer:
      "プロジェクトのソースコード、プレゼンテーション資料が必要です。詳細は応募作品提出方法のページをご確認ください。",
  },
  {
    question: "知的財産権はどうなりますか？",
    answer:
      "作品の知的財産権は制作者に帰属します。ただし、NEMTUSは作品を広報目的で使用する権利を有します。",
  },
  {
    question: "お問い合わせ先を教えてください",
    answer:
      "ご質問はDiscord（https://discord.gg/a5XAXBubT2）またはTelegram（https://t.me/NEMTUS）でお気軽にお問い合わせください。NEMTUSコミュニティが丁寧にサポートいたします。",
  },
]

export function FAQ() {
  const { ref, isInView } = useInView()

  return (
    <section id="faq" ref={ref} className="relative py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-300 md:text-5xl">FAQ</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card-hover/50 border-muted/30 hover:border-muted/50 rounded-lg border px-6 transition-colors duration-300"
              >
                <AccordionTrigger className="text-muted-foreground hover:text-foreground text-left transition-colors">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground/80 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
