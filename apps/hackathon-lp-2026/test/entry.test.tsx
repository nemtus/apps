import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Entry } from "@/components/entry"
import { ENTRY_URL, IS_HACKATHON_ENDED } from "@/lib/constants"

// The entry CTA is gated by IS_HACKATHON_ENDED. With the flag ON (current state),
// the CTA must be inert — this guards against accidentally re-opening entry.
describe("<Entry /> — hackathon ended (IS_HACKATHON_ENDED = true)", () => {
  it("precondition: the ended flag is on", () => {
    expect(IS_HACKATHON_ENDED).toBe(true)
  })

  it("renders the entry CTA as a disabled button, not an active link", () => {
    render(<Entry />)
    const cta = screen.getByRole("button", { name: /エントリー・作品提出/ })
    expect(cta).toBeDisabled()
  })

  it("exposes no active link to the AKINDO entry URL while ended", () => {
    render(<Entry />)
    const hrefs = screen.queryAllByRole("link").map((a) => a.getAttribute("href"))
    expect(hrefs).not.toContain(ENTRY_URL)
  })
})
