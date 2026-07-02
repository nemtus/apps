"use client"

import { ARCHIVE_URL } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">主催</h3>
            <p className="text-muted-foreground text-sm">NPO法人NEM技術普及推進会NEMTUS</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">お問い合わせ</h3>
            <a
              href="mailto:info@nemtus.com"
              className="text-muted-foreground text-sm hover:text-primary transition-colors"
            >
              info@nemtus.com
            </a>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">SNS</h3>
            <div className="flex gap-4 items-center flex-wrap">
              <a
                href="https://x.com/NemtusOfficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-xl leading-none"
              >
                <span className="sr-only">X (Twitter)</span>𝕏
              </a>
              <a
                href="https://www.youtube.com/channel/UCfJ9GvY4ZoSi_RHYQjbsEZA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-base leading-none"
              >
                <span className="sr-only">YouTube</span>▶
              </a>
              <a
                href="https://github.com/nemtus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-xl leading-none"
              >
                <span className="sr-only">GitHub</span>⚙
              </a>
              <a
                href="https://nemtus.connpass.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-base leading-none font-bold"
              >
                <span className="sr-only">connpass</span>C
              </a>
              <span className="text-muted-foreground">|</span>
              <a
                href={ARCHIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors text-sm whitespace-nowrap"
              >
                過去のHACK＋
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2025 NEMTUS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
