"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

const SOCIAL_LINKS = [
  { name: "X (Twitter)", url: "https://x.com/NemtusOfficial/", icon: "𝕏" },
  { name: "YouTube", url: "https://www.youtube.com/channel/UCfJ9GvY4ZoSi_RHYQjbsEZA", icon: "▶" },
  { name: "Website", url: "https://nemtus.com", icon: "🌐" },
  { name: "Zenn", url: "https://zenn.dev/nemtus", icon: "Z" },
  { name: "GitHub", url: "https://github.com/nemtus", icon: "⚙" },
  { name: "connpass", url: "https://nemtus.connpass.com/", icon: "C" },
]

export function NemtusInfo() {
  const { ref, isInView } = useInView()

  return (
    <section id="nemtus" ref={ref} className="py-12 md:py-20 relative">
      <div className="container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-300">NEMTUS とは？</h2>

          <Card className="bg-white/5 border-white/10 p-6 md:p-8 mb-8">
            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-4 text-left text-pretty">
              NEMTUSは、NPO法人として、NEM/Symbol技術の普及と発展に取り組んでいます。
            </p>
            <p className="text-sm md:text-base text-white/70 leading-relaxed text-left text-pretty">
              ブロックチェーン技術を通じて、より良い社会の実現を目指し、開発者コミュニティの育成、技術教育、そして革新的なプロジェクトの支援を行っています。
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {SOCIAL_LINKS.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:border-[#00E5FF]/50 hover:bg-white/10 transition-all duration-300 text-white/80 hover:text-white w-full"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-sm font-medium">{link.name}</span>
                <ExternalLink size={14} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
