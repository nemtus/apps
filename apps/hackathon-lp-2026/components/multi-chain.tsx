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
    <section id="multi-chain" ref={ref} className="relative overflow-hidden py-12 md:py-20">
      <div className="container mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-300 md:text-4xl">
              Welcome any blockchain.
            </h2>
          </div>

          <div className="mb-12">
            <div className="mb-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="mb-4 inline-block"
              >
                <span className="rounded-full border border-purple-400/30 bg-purple-500/20 px-6 py-2 text-xs font-bold text-purple-300 md:text-sm">
                  推奨チェーン
                </span>
              </motion.div>
              <h3 className="mb-3 text-2xl font-bold text-gray-300 md:text-4xl">
                <span className="text-primary">NEM</span>
                <span className="text-white"> / </span>
                <span className="text-purple-400">SYMBOL</span>
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                このハッカソンの
                <br className="md:hidden" />
                メインブロックチェーン
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {mainChains.map((chain, index) => (
                <motion.div
                  key={chain.name}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Card className="flex h-full flex-col border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10 md:p-8">
                    <div className="mb-4 flex flex-col items-center gap-4 md:flex-row">
                      <div className="relative h-16 w-16 flex-shrink-0 md:h-20 md:w-20">
                        <Image
                          src={chain.logo || "/placeholder.svg"}
                          alt={`${chain.name} logo`}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                      <h4 className="text-2xl font-bold text-white md:text-3xl">{chain.name}</h4>
                    </div>
                    <p className="flex-grow text-sm leading-normal text-gray-300 md:text-base">
                      {chain.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-center text-base font-bold text-gray-300 md:text-lg">
              どのブロックチェーンでも
              <br className="md:hidden" />
              参加OK
            </h3>
            <Card className="border-white/10 bg-white/5 p-4 md:p-6">
              <p className="text-muted-foreground mb-4 text-left text-xs leading-normal md:text-center md:text-sm">
                上記以外にも、様々なブロックチェーン技術を活用した作品を歓迎します。あなたの得意な技術で、革新的なアイデアを実現してください。
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {supportedChains.map((chain, index) => (
                  <motion.div
                    key={chain.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    className="flex flex-col items-center gap-2 rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10"
                  >
                    <div className="relative flex h-10 w-10 items-center justify-center">
                      <Image
                        src={chain.logo || "/placeholder.svg"}
                        alt={`${chain.name} logo`}
                        width={40}
                        height={40}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-muted-foreground w-full text-center text-xs break-words">
                      {chain.name}
                    </span>
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
