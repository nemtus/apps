import { expect, test } from "@playwright/test";

test.describe("利用規約ページ", () => {
  test("参加規約とプライバシーポリシーのセクションが表示される", async ({ page }) => {
    const response = await page.goto("/terms");
    expect(response?.status()).toBeLessThan(400);

    await expect(page.locator("#term")).toContainText("参加規約");
    await expect(page.locator("#privacy")).toContainText("プライバシーポリシー");
  });
});
