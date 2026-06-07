import { expect, test } from "@playwright/test";

test.describe("ナビゲーション (デスクトップ)", () => {
  test("ヘッダーから Registration / Terms / Home を往復できる", async ({ page }) => {
    await page.goto("/");

    // Registration へ
    await page.getByRole("link", { name: "Registration" }).first().click();
    await expect(page).toHaveURL(/\/registration/);
    await expect(page.getByRole("heading", { name: "Apply for an event" })).toBeVisible();

    // Terms へ (ヘッダーのナビから)
    await page.getByRole("link", { name: "Terms" }).first().click();
    await expect(page).toHaveURL(/\/terms/);

    // ロゴから Home へ戻る
    await page.getByRole("link", { name: "symbol-logo-wide" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
