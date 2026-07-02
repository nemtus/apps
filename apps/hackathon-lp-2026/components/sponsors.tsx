"use client"

import { motion } from "framer-motion"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { useState } from "react"

const SPONSOR_FORM_URL =
  "https://docs.google.com/forms/d/17fG0KkelfOregkwpexwH4NeugNlxTjoiciZao_77fXc/edit"

const SPONSOR_LOGOS = [
  {
    name: "Astar",
    logo: "/SP_Astar_Color_Black.png",
    description:
      "AstarはWeb3を広げるためのプロジェクトです。レイヤー1ブロックチェーン「Astar Network」とSony Block Solutions Labs開発のLayer 2「Soneium」を結びつけ、日常で使いやすいアプリや決済・DeFiサービスを通じて、Web3.0のメインストリーム化を後押しします。エコシステムトークンとなる「ASTR」はSoneiumをはじめとしたエコシステムを活性化し、同時にAstar NetworkのガバナンスやdAppステーキングといった中核機能と連動して、さらなる成長を実現します。Astarはインフラの安全性・スケーラビリティを活かしながら、多くのユーザーと開発者を惹きつけるWeb3.0エコシステムを築き、数十億人規模へのWeb3.0普及を目指します。",
    url: "https://astar.network/",
  },
  {
    name: "Soneium",
    logo: "/images/sp-one-line-full-color-light.png",
    description:
      "Soneiumは、Sony Block Solutions Labsによって開発されたEthereumのレイヤー2であり、感情を呼び起こし、創造性を引き出し、境界を越えたオープンなインターネットの実現を目指す汎用型ブロックチェーンプラットフォームです。文化的な違いを乗り越え、多様な価値観を持つ人々をつなぐことで、Soneiumはインターネットとの関わり方を再定義し、世界を感動で満たす革新的なアプリケーションの可能性を切り拓きます。",
    url: "https://soneium.org/",
  },
  {
    name: "Crypto Lounge GOX",
    logo: "/images/sp-gox-logo-w.png",
    description:
      "東京都心の東新宿に位置し、初心者から上級者まで、クリプトやブロックチェーン技術に関心を持つ人々が集い、学び、交流する場となっています。",
    url: "https://cryptoloungegox.com/",
  },
  {
    name: "株式会社WAVEE",
    logo: "/images/sp-wavee2.png",
    description:
      "「Give to Earn」をコンセプトに、人と仕事の最適なマッチングを促すべく、あらゆる人材・案件をブロックチェーンを介してDAO的に統合することを目指す完全招待制Web3.0時代の仕事マッチングプラットフォーム。",
    url: "https://wavee.world/",
  },
  {
    name: "不思議な宿",
    logo: "/sp_fushiginayado.png",
    description:
      "不思議な宿は、京都・五条に佇む体験型ホテル。全9室それぞれが「多い部屋」「代謝の部屋」「ゲームの部屋」など異なるコンセプトを持ち、エンタメやテクノロジー、デジタルアートを通じて遊び心と創造力を刺激する滞在を提供します。",
    url: "https://hpdsp.jp/fushiginayado/",
  },
  {
    name: "Atmos-Seed合同会社",
    logo: "/SP_as_logo.png",
    description:
      "Atomos-Seedでは、企業や事業、地方自治体や団体などが抱える課題に対し、ブロックチェーンやAI・IoT・XRなどのテクノロジーを適切に活用して解消したり、大切な価値を拡張したり、新しい価値を創出したりしながら、Web3の社会実装と新しい経済圏の創出を進めています。",
    url: "https://atomosseed.com/",
  },
  {
    name: "国立日本総合研究センター株式会社",
    logo: "/images/chaintokyo.png",
    description:
      "国立日本総合研究センターではchain.tokyoというブランドのバーチャルオフィス＆コワーキングスペースを日本全国に展開中。合同会社型DAOの立ち上げにも最適なサポートプランなども用意し、コミュニティビジネスなどでの調達にも最適な環境を提供いたします。",
    url: "https://jgrec.jp/",
  },
  {
    name: "株式会社インプリム",
    logo: "/images/pleasanter.png",
    description:
      "無償で使えるオープンソースのノーコード・ローコード開発ツール「プリザンター」の開発企業",
    url: "https://implem.co.jp/",
  },
  {
    name: "株式会社Progate",
    logo: "/images/sp-progate.png",
    description:
      "オンラインプログラミング学習サービス Progate が学生向けに開放する開発拠点です。東京大学および京都大学近くのコワーキングスペースを 無料で24時間利用でき、仲間づくりからプロダクト作りまでを一気に加速させることができます。参加は「Progate Pathの学生アンバサダー登録」が必要です。Discord での技術相談やオフライン勉強会など、学びと交流の機会も充実しています。“つくりたい”気持ちがあれば専攻不問――京都ハッカソンハウスで、あなたのアイデアを形にしよう。",
    url: "https://prog-8.com/",
  },
  {
    name: "SEKKA SHIRETOKO",
    logo: "/SP_SEKKA_SHIRETOKO.jpeg",
    description:
      "世界遺産・知床の自然に包まれた雪霞 SEKKA SHIRETOKO。流氷を望むウナベツスキー場の目の前に位置し、源泉かけ流しの天然温泉と旬の味覚、コワーキングスペースを備えた新しい滞在型ホテル。自然と創造が交わる特別な時間を提供します。",
    url: "https://sekkahotel.com/",
  },
]

function SponsorCard({
  sponsor,
  index,
  isInView,
}: {
  sponsor: (typeof SPONSOR_LOGOS)[0]
  index: number
  isInView: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const shouldTruncate = sponsor.description.length > 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 80, rotateY: -20, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0, rotateY: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 1.0,
        delay: 0.6 + index * 0.22,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 },
      }}
      className="relative h-full w-full"
    >
      <div className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div
          className="from-primary via-secondary to-tertiary animate-gradient-flow absolute inset-0 rounded-lg bg-gradient-to-r bg-[length:200%_100%]"
          style={{
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />
      </div>

      <div className="bg-card-hover border-border hover:bg-muted group relative flex h-full min-h-[320px] w-full flex-col rounded-lg border p-6 transition-all duration-300 hover:border-transparent">
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-shrink-0 flex-col"
        >
          <div className="mb-4 flex h-32 items-center justify-center rounded-md bg-white p-4">
            <img
              src={sponsor.logo || "/placeholder.svg"}
              alt={sponsor.name}
              className="max-h-full max-w-full object-contain opacity-100 transition-opacity duration-300 group-hover:opacity-70"
            />
          </div>
          <h3 className="group-hover:text-primary mb-2 text-left text-lg font-semibold break-words transition-colors">
            {sponsor.name}
          </h3>
        </a>

        <div className="flex flex-grow flex-col">
          <p
            className={`text-muted-foreground text-left text-sm leading-relaxed text-pretty break-words ${!isExpanded && shouldTruncate ? "line-clamp-3" : ""}`}
          >
            {sponsor.description}
          </p>

          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 flex items-center gap-1 self-start text-sm text-purple-400 transition-colors hover:text-purple-300"
            >
              {isExpanded ? (
                <>
                  閉じる <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  もっと見る <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex flex-shrink-0 justify-center"
        >
          <ExternalLink className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
        </a>
      </div>
    </motion.div>
  )
}

export function Sponsors() {
  const { ref, isInView } = useInView({ amount: 1.0 })

  return (
    <section id="sponsors" ref={ref} className="relative py-6 md:py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-300 md:text-5xl">SPONSOR</h2>
          <p className="text-muted-foreground px-4 text-left text-sm text-pretty md:px-0 md:text-center">
            NEMTUS Hackathon 2026 Hack+ を
            <br className="sm:hidden" />
            支援して頂くスポンサー
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mb-6 max-w-6xl"
        >
          <div className="bg-card/50 border-border/30 relative rounded-lg border p-6 backdrop-blur-sm md:p-8">
            <div className="mb-3 flex justify-center">
              <span className="bg-muted/30 border-border/20 inline-block rounded-full border px-4 py-1 text-xs font-bold text-gray-300">
                SPECIAL SPONSOR
              </span>
            </div>

            <a
              href="https://x.com/SymbolSyndicate"
              target="_blank"
              rel="noopener noreferrer"
              className="group/link mb-3 block"
            >
              <div className="flex justify-center">
                <img
                  src="/sp_tss_logo.png"
                  alt="The Symbol Syndicate"
                  className="h-auto max-w-full max-w-xs transition-opacity group-hover/link:opacity-80 md:max-w-md"
                />
              </div>
            </a>

            <a
              href="https://x.com/SymbolSyndicate"
              target="_blank"
              rel="noopener noreferrer"
              className="group/link block"
            >
              <h3 className="mb-3 flex items-center justify-center gap-2 text-center text-xl font-bold whitespace-nowrap text-gray-300 transition-colors group-hover/link:text-gray-200 sm:text-2xl md:text-3xl">
                The Symbol Syndicate
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover/link:text-gray-300 md:h-5 md:w-5" />
              </h3>
            </a>

            <p className="mx-auto max-w-3xl text-center text-sm leading-normal text-gray-400 md:text-base">
              The Symbol
              Syndicate（TSS）は、NEMおよびSymbolブロックチェーンのエコシステムを推進する非営利組織です。NEMやSymbolブロックチェーンのプロトコルに関する技術開発を行い、世界各地でのエコシステム発展を支援しています。
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mb-6 max-w-6xl"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SPONSOR_LOGOS.map((sponsor, index) => (
              <SponsorCard key={sponsor.name} sponsor={sponsor} index={index} isInView={isInView} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1.0, delay: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="mx-auto max-w-6xl pb-6 text-center"
        >
          <a
            href={SPONSOR_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-300"
          >
            スポンサー募集中
            <ExternalLink className="h-3 w-3" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
