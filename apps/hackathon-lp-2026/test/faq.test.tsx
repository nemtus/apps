import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { FAQ } from "@/components/faq"

describe("<FAQ /> accordion", () => {
  it("renders each question as a collapsed trigger", () => {
    render(<FAQ />)
    const trigger = screen.getByRole("button", { name: /参加資格はありますか/ })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("expands the answer when its question is clicked", async () => {
    const user = userEvent.setup()
    render(<FAQ />)
    const trigger = screen.getByRole("button", { name: /参加資格はありますか/ })

    await user.click(trigger)

    expect(trigger).toHaveAttribute("aria-expanded", "true")
  })
})
