"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { useInView } from "@/hooks/use-in-view"

export function MultiChain() {
  const { ref, isInView } = useInView()

  const mainChains = [
    {
      name: "NEM",
      logo: "/cryptlogo/NEM_Logo.png",
      description:
        "開発者フレンドリーなAPI設計で、迅速なプロトタイプ開発が可能。2015年から運用される安定したプラットフォームで、シンプルな設計により初心者でも扱いやすいです。Proof of Importanceによる公平な報酬システムと、マルチシグによる安全な資産管理を簡単に実装できます。",
    },
    {
      name: "SYMBOL",
      logo: "/cryptlogo/Symbol_Logo.png",
      description:
        "NEMの次世代ブロックチェーン。アグリゲートトランザクションで複数の操作を1つにまとめて実行でき、複雑なビジネスロジックもシンプルに実装。オリジナルトークン（モザイク）の発行も数クリックで可能。様々な企業での実装事例も増えており、SDKも充実しています。",
    },
  ]

  const supportedChains = [
    { name: "Bitcoin", logo: "/cryptlogo/BitcoinLogo.png" },
    { name: "Ethereum", logo: "/cryptlogo/eth.png" },
    { name: "Astar Network", logo: "/cryptlogo/Astar_logo.png" },
    { name: "Soneium", logo: "/cryptlogo/soneiumLogo.png" },
    { name: "Cosmos SDK", logo: "/cryptlogo/CosmosLogo.png" },
    { name: "Monacoin", logo: "/cryptlogo/mona.png" },
    { name: "Avalanche", logo: "/cryptlogo/avalanche_logo.png" },
    { name: "Sui", logo: "/cryptlogo/suilogo.png" },
  ]

  return (
    <section id="multi-chain" ref={ref} className="py-12 md:py-20 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-300">Welcome any blockchain.</h2>
          </div>

          <div className="mb-12">
            <div className="text-center mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <span className="bg-purple-500/20 text-purple-300 text-xs md:text-sm font-bold px-6 py-2 rounded-full border border-purple-400/30">
                  推奨チェーン
                </span>
              </motion.div>
              <h3 className="text-2xl md:text-4xl font-bold mb-3 text-gray-300">
                <span className="text-primary">NEM</span>
                <span className="text-white"> / </span>
                <span className="text-purple-400">SYMBOL</span>
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                このハッカソンの
                <br className="md:hidden" />
                メインブロックチェーン
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mainChains.map((chain, index) => (
                <motion.div
                  key={chain.name}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Card className="bg-white/5 border-white/10 p-6 md:p-8 h-full flex flex-col hover:bg-white/10 transition-colors">
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0">
                        <Image
                          src={chain.logo || "/placeholder.svg"}
                          alt={`${chain.name} logo`}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                      <h4 className="text-2xl md:text-3xl font-bold text-white">{chain.name}</h4>
                    </div>
                    <p className="text-gray-300 text-sm md:text-base leading-normal flex-grow">{chain.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base md:text-lg font-bold text-center mb-4 text-gray-300">
              どのブロックチェーンでも
              <br className="md:hidden" />
              参加OK
            </h3>
            <Card className="bg-white/5 border-white/10 p-4 md:p-6">
              <p className="text-xs md:text-sm text-muted-foreground leading-normal mb-4 text-left md:text-center">
                上記以外にも、様々なブロックチェーン技術を活用した作品を歓迎します。あなたの得意な技術で、革新的なアイデアを実現してください。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {supportedChains.map((chain, index) => (
                  <motion.div
                    key={chain.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-10 h-10 relative flex items-center justify-center">
                      <Image
                        src={chain.logo || "/placeholder.svg"}
                        alt={`${chain.name} logo`}
                        width={40}
                        height={40}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                    <span className="text-xs text-center text-muted-foreground break-words w-full">{chain.name}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
