"use client"

import { ARCHIVE_URL } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-border bg-background relative z-10 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-foreground mb-4 text-lg font-bold">主催</h3>
            <p className="text-muted-foreground text-sm">NPO法人NEM技術普及推進会NEMTUS</p>
          </div>

          <div>
            <h3 className="text-foreground mb-4 text-lg font-bold">お問い合わせ</h3>
            <a
              href="mailto:info@nemtus.com"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              info@nemtus.com
            </a>
          </div>

          <div>
            <h3 className="text-foreground mb-4 text-lg font-bold">SNS</h3>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://x.com/NemtusOfficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-xl leading-none transition-colors"
              >
                <span className="sr-only">X (Twitter)</span>𝕏
              </a>
              <a
                href="https://www.youtube.com/channel/UCfJ9GvY4ZoSi_RHYQjbsEZA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-base leading-none transition-colors"
              >
                <span className="sr-only">YouTube</span>▶
              </a>
              <a
                href="https://github.com/nemtus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-xl leading-none transition-colors"
              >
                <span className="sr-only">GitHub</span>⚙
              </a>
              <a
                href="https://nemtus.connpass.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-base leading-none font-bold transition-colors"
              >
                <span className="sr-only">connpass</span>C
              </a>
              <span className="text-muted-foreground">|</span>
              <a
                href={ARCHIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-sm whitespace-nowrap transition-colors"
              >
                過去のHACK＋
              </a>
            </div>
          </div>
        </div>

        <div className="border-border border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2026 NEMTUS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
