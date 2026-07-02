import { expect, test } from "@playwright/test"

test.describe("hackathon 2026 landing page", () => {
  test("loads with the expected title and no JS runtime errors", async ({ page }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []
    page.on("console", (msg) => {
      // Ignore benign resource-load failures (e.g. the browser's /favicon.ico probe);
      // this guardrail targets application/JS errors, not missing static assets.
      if (msg.type() === "error" && !/Failed to load resource/.test(msg.text())) {
        consoleErrors.push(msg.text())
      }
    })
    page.on("pageerror", (err) => pageErrors.push(String(err)))

    await page.goto("/")

    await expect(page).toHaveTitle(/NEMTUS Hackathon 2026/)
    await expect(page.locator("body")).toBeVisible()
    expect(pageErrors, `uncaught page errors:\n${pageErrors.join("\n")}`).toEqual([])
    expect(consoleErrors, `console errors:\n${consoleErrors.join("\n")}`).toEqual([])
  })

  test("renders the key on-page sections", async ({ page }) => {
    await page.goto("/")
    for (const id of ["entry", "prizes", "schedule", "faq"]) {
      await expect(page.locator(`#${id}`), `#${id}`).toBeAttached()
    }
  })

  test("entry CTA is inert while the hackathon is ended", async ({ page }) => {
    await page.goto("/")
    // No active outbound entry link (AKINDO) while ended…
    await expect(page.locator('a[href*="akindo.io"]')).toHaveCount(0)
    // …and the CTA is present but disabled.
    await expect(page.getByRole("button", { name: /エントリー・作品提出/ })).toBeDisabled()
  })

  test("FAQ answer expands when its question is clicked", async ({ page }) => {
    await page.goto("/")
    const trigger = page.getByRole("button", { name: /参加資格はありますか/ })
    await trigger.scrollIntoViewIfNeeded()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
  })
})
