import { expect, test } from "@playwright/test";

// モバイルビューポートでのハンバーガーメニュー導線
test.describe("モバイルナビゲーション", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("ハンバーガーで開いたメニューからページ遷移できる", async ({ page }) => {
    await page.goto("/");

    // デスクトップ用ナビはモバイルでは非表示
    const desktopRegistration = page.getByRole("navigation").getByRole("link", { name: "Registration" });
    await expect(desktopRegistration).toBeHidden();

    // ハンバーガーボタン (ヘッダー内の唯一のボタン) を開く
    await page.locator("header").getByRole("button").click();

    // 開いたモバイルメニュー内の Registration リンクで遷移
    const mobileLink = page.getByRole("link", { name: "Registration" });
    await expect(mobileLink).toBeVisible();
    await mobileLink.click();

    await expect(page).toHaveURL(/\/registration/);
  });
});
