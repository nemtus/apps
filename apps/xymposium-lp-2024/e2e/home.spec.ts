import { expect, test } from "@playwright/test";

test.describe("トップページ", () => {
  test("タイトルと全セクションの見出しが表示される", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Symbol\/NEM Community Xymposium/);

    // 主要セクションの見出し
    await expect(page.getByRole("heading", { name: /Community Xymposium/i }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "What’s in Xymposium?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "参加者" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "開催概要" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "プログラム" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "よくある質問" })).toBeVisible();
  });

  test("各セクションのアンカーが存在する", async ({ page }) => {
    await page.goto("/");
    for (const id of ["features", "participant", "event", "programs", "questions"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test("プログラムのタイムテーブルが表示される", async ({ page }) => {
    await page.goto("/");
    const programs = page.locator("#programs");
    await expect(programs.getByText("18:30")).toBeVisible();
    await expect(programs.getByText("Xymposium Session")).toBeVisible();
  });

  test("FAQ をクリックすると回答が展開される", async ({ page }) => {
    await page.goto("/");
    const question = page.getByRole("button", { name: "参加にあたって注意事項はありますか？" });

    await expect(question).toHaveAttribute("aria-expanded", "false");
    await question.click();
    await expect(question).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/利用規約をご確認下さい/)).toBeVisible();
  });

  test("フッターと外部リンクが表示される", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toContainText("NEMTUS");
    await expect(footer.getByRole("link", { name: /github/i }).or(footer.locator('a[href*="github.com"]'))).toHaveCount(
      1,
    );
  });
});
