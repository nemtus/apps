"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Trophy, Award, Star, ChevronDown } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { useState } from "react"

const PRIZES = [
  {
    icon: Trophy,
    title: "最優秀賞 (1st)",
    description: "1,500 USDC × 2テーマ",
    gradient: "from-[#FFD700] via-[#FFC700] to-[#FFAA00]",
  },
  {
    icon: Award,
    title: "優秀賞 (2nd)",
    description: "1,000 USDC × 2テーマ",
    gradient: "from-[#E8E8E8] via-[#C0C0C0] to-[#A8A8A8]",
  },
  {
    icon: Star,
    title: "特別賞 (3rd)",
    description: "500 USDC × 2テーマ",
    gradient: "from-[#D4A574] via-[#CD7F32] to-[#B87333]",
  },
]

const SPONSOR_PRIZES = [
  {
    name: "Astar / Soneium 賞",
    prize: "$300相当の暗号資産",
    details:
      "副賞：本作品の継続的開発、プロダクトリリースを目指す場合に、Astar ガバナンスの助成金プログラムであるUCG（Unstoppable Community Grant Program）へ提案するためのサポートをします。",
    criteria: `以下のいずれかのブロックチェーン上にデプロイされたdAppを元にした作品、プロダクトを提出した、1つのチーム（あるいは個人）を選出。

・Astar Network
・Shibuya（Astar Network テストネット）
・Soneium
・Soneium Minato（Soneium テストネット）

審査基準としては、以下のいずれかを満たすこと。

１，国内の Web3 ユースケースとして、マスアダプション（大規模利用）を意識したプロダクトであること

２，ステーブルコイン（JPY または USD ペグ）の活用を意識したプロダクトであること

３，小売店向けに、ユーザーやファンを集め、惹きつける仕組みを備えたプロダクトであること`,
  },
  {
    name: "Crypto Lounge GOX賞",
    prize: "GOXコワーキング利用1ヶ月間無料",
    details:
      "GOXコワーキング利用1ヶ月間無料（通常1日利用2,000円）。GOXが開店していて貸切利用が入っていない日（主に平日11時〜19時の間）にいつでもドリンクバー付きで無料で滞在していただけるチケットになります。\n※1ヶ月間をどの期間にするかは受賞者と相談の上決定",
    criteria: "審査基準は調整中です。",
  },
  {
    name: "不思議な宿賞",
    prize: "1組2名ペア宿泊券",
    details: "1組2名で不思議な宿に宿泊していただける宿泊券です。",
    criteria: "logicalと気合い",
  },
  {
    name: "Atomos-Seed賞",
    prize: "1年間の継続サポート",
    details:
      "＜1年間の継続サポート＞\n・1時間×6回のオンライン相談\n・企業や自治体などへアクセスする際の推薦状\n・弊社公式サイトで紹介 (無期限)",
    criteria: `（Free・ネタ駆動開発ともに）1年間サポートしたくなる作品を選びます。

1. 革新性があるか
　【Free】課題解決や社会実装に新しいアプローチで技術を使っているか？
　【ネタ駆動開発】思わず笑ってしまうような技術の使い方を大真面目にしているか？

2. 心に残り、何度も伝えたくなるか・使いたくなるか
　【Free】実現可能性があるか、継続できる魅力があるか
　【ネタ駆動開発】思わず人に伝えたくなるおもしろさと技術の使い方の妙があるか

3. 【共通】技術活用に工夫があるか
　例：ブロックチェーンの斬新な活用の仕方、技術的なこだわり、実装の工夫、UXの設計など`,
  },
  {
    name: "国立日本総合研究センター賞",
    prize: "chain.tokyo国立メモリアルグッズ",
    details: "chain.tokyo国立メモリアルグッズ",
    criteria:
      "キーワード「国」。いま日本が世界に向け、どうイノベーションを起こしていけるか？を重視した基準で選考したいと思います。",
  },
  {
    name: "SEKKA SHIRETOKO賞",
    prize: "賞状とchain.shiretoko利用券＋α",
    details: "賞状とchain.shiretoko利用券、その他特典をご用意しています。",
    criteria: "北海道・知床 や旅行などに関わりそうな視点で実現性の高そうなもの",
  },
]

function SponsorPrizeCard({ prize, index }: { prize: (typeof SPONSOR_PRIZES)[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const { ref, isInView } = useInView<HTMLDivElement>()
  const contentId = `sponsor-prize-${index}`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="w-full"
    >
      <Card className="h-full border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/20">
        <div className="mb-4 flex flex-col items-center">
          <h3 className="text-center text-lg font-bold text-gray-200">{prize.name}</h3>
          <p className="mt-2 text-center text-sm text-gray-400">{prize.prize}</p>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary hover:text-primary/80 mt-4 flex w-full items-center justify-center gap-2 text-sm transition-colors"
          aria-expanded={isOpen}
          aria-controls={contentId}
        >
          <span>詳細を見る</span>
          <ChevronDown
            size={16}
            className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
          id={contentId}
          role="region"
          aria-hidden={!isOpen}
        >
          <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-300">賞の内容</h4>
              <p className="text-sm leading-relaxed whitespace-pre-line text-gray-400">
                {prize.details}
              </p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-300">審査基準</h4>
              <p className="text-sm leading-relaxed whitespace-pre-line text-gray-400">
                {prize.criteria}
              </p>
            </div>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}

export function Prizes() {
  const { ref, isInView } = useInView()

  return (
    <section id="prizes" ref={ref} className="relative py-12 md:py-20">
      <div className="container mx-auto overflow-hidden px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-300 md:text-5xl">賞金</h2>
          <p className="mx-auto max-w-2xl text-base text-gray-400 md:text-lg">
            各テーマごとに1位～3位を表彰します
          </p>
        </motion.div>

        <div className="mx-auto mb-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {PRIZES.map((prize, index) => (
            <motion.div
              key={prize.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="w-full"
            >
              <Card className="from-primary/20 via-secondary/20 to-tertiary/20 border-border hover:border-primary/50 group relative h-full w-full overflow-hidden bg-gradient-to-br p-6 transition-all duration-300">
                <div
                  className={`h-16 w-16 rounded-full bg-gradient-to-br ${prize.gradient} mx-auto mb-4 flex flex-shrink-0 items-center justify-center shadow-lg`}
                >
                  <prize.icon size={28} className="text-black/80" />
                </div>
                <h3 className="text-foreground mb-3 text-center text-xl font-bold break-words">
                  {prize.title}
                </h3>
                <p className="text-muted-foreground text-center text-sm leading-relaxed text-pretty break-words">
                  {prize.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 text-center"
          >
            <h3 className="mb-3 text-2xl font-bold text-gray-300 md:text-3xl">スポンサー賞</h3>
            <p className="text-sm text-gray-400 md:text-base">
              各スポンサーから特別賞をご用意しています
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {SPONSOR_PRIZES.map((prize, index) => (
              <SponsorPrizeCard key={prize.name} prize={prize} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
