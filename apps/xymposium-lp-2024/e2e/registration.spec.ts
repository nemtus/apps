import { expect, test } from "@playwright/test";

test.describe("登録ページ", () => {
  test("受付終了の案内が表示される", async ({ page }) => {
    await page.goto("/registration");

    await expect(page).toHaveTitle(/Registration/);
    await expect(page.getByRole("heading", { name: "Apply for an event" })).toBeVisible();
    await expect(page.getByText("受付を終了しました")).toBeVisible();
  });
});
