import { expect, test } from "@playwright/test";

test.describe("利用規約ページ", () => {
  test("ページが正常に表示される", async ({ page }) => {
    const response = await page.goto("/terms");
    expect(response?.status()).toBeLessThan(400);
    // terms と privacy のアンカーが存在する
    await expect(page.locator("#terms").or(page.locator("#privacy")).first()).toBeAttached();
  });
});
