"use client"

import { Hero } from "@/components/hero"
import { Results } from "@/components/results"
import { About } from "@/components/about"
import { Themes } from "@/components/themes"
import { Entry } from "@/components/entry"
import { Highlights } from "@/components/highlights"
import { Prizes } from "@/components/prizes"
import { Schedule } from "@/components/schedule"
import { Judges } from "@/components/judges"
import { MultiChain } from "@/components/multi-chain"
import { Sponsors } from "@/components/sponsors"
import { NemtusInfo } from "@/components/nemtus-info"
import { FAQ } from "@/components/faq"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { CircuitBackground } from "@/components/circuit-background"
import { ParticipationFlow } from "@/components/participation-flow"

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white">
      <CircuitBackground />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <Results />
        <About />
        <ParticipationFlow />
        <Themes />
        <MultiChain />
        <Prizes />
        <Schedule />
        <Entry />
        <Highlights />
        <Judges />
        <Sponsors />
        <FAQ />
        <NemtusInfo />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
