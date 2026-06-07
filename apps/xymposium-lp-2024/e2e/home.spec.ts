import { expect, test } from "@playwright/test";

test.describe("トップページ", () => {
  test("タイトルと主要セクションが表示される", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Symbol\/NEM Community Xymposium/);
    await expect(page.getByRole("heading", { name: /Community Xymposium/i }).first()).toBeVisible();
    // FAQ セクション
    await expect(page.getByText("よくある質問")).toBeVisible();
  });

  test("グローバルナビゲーションから各ページへ遷移できる", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Registration" }).first().click();
    await expect(page).toHaveURL(/\/registration/);
    await expect(page.getByRole("heading", { name: "Apply for an event" })).toBeVisible();
  });
});
