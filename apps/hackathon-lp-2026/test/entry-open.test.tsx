import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { Entry } from "@/components/entry"
import { ENTRY_URL } from "@/lib/constants"

// Re-open entry by mocking the flag off; the entry window is already open by date
// (ENTRY_START_DATE is in the past), so the active AKINDO link must appear.
// vi.mock is hoisted above the imports above by Vitest, so Entry sees the mock.
vi.mock("@/lib/constants", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/constants")>()
  return { ...actual, IS_HACKATHON_ENDED: false }
})

describe("<Entry /> — entry open (IS_HACKATHON_ENDED = false)", () => {
  it("renders an active entry link pointing at the AKINDO URL", () => {
    render(<Entry />)
    const link = screen.getByRole("link", { name: /エントリー・作品提出/ })
    expect(link).toHaveAttribute("href", ENTRY_URL)
    expect(link).toHaveAttribute("target", "_blank")
  })
})
