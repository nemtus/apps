import { describe, expect, it } from "vitest"
import {
  ARCHIVE_URL,
  CONNPASS_URL,
  DISCORD_URL,
  ENTRY_END_DATE,
  ENTRY_START_DATE,
  ENTRY_URL,
  IS_HACKATHON_ENDED,
  RULES_PDF_URL,
  SUBMIT_PDF_URL,
  TELEGRAM_URL,
} from "@/lib/constants"

// These encode the LP's content contract so an accidental edit (swapped dates,
// a non-boolean flag, a broken link) fails CI instead of shipping.
describe("lib/constants — spec invariants", () => {
  it("the entry window is a valid range (start strictly before end)", () => {
    expect(Number.isNaN(ENTRY_START_DATE.getTime())).toBe(false)
    expect(Number.isNaN(ENTRY_END_DATE.getTime())).toBe(false)
    expect(ENTRY_START_DATE.getTime()).toBeLessThan(ENTRY_END_DATE.getTime())
  })

  it("IS_HACKATHON_ENDED is a boolean flag", () => {
    expect(typeof IS_HACKATHON_ENDED).toBe("boolean")
  })

  it("every external link is an absolute https URL", () => {
    const urls = {
      ENTRY_URL,
      RULES_PDF_URL,
      SUBMIT_PDF_URL,
      DISCORD_URL,
      TELEGRAM_URL,
      CONNPASS_URL,
      ARCHIVE_URL,
    }
    for (const [name, url] of Object.entries(urls)) {
      expect(url, name).toMatch(/^https:\/\//)
      expect(() => new URL(url), name).not.toThrow()
    }
  })
})
