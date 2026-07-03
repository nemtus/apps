import { expect, test } from "@playwright/test";

test.describe("メタデータ / PWA", () => {
  test("OGP / Twitter のメタタグが出力される", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
    // Twitter カードのメタ (root layout の metadata.twitter)
    await expect(page.locator('meta[name="twitter:card"], meta[name="twitter:title"]').first()).toHaveCount(1);
  });

  test("manifest.webmanifest が配信される", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.name).toContain("Community Xymposium");
    expect(Array.isArray(json.icons)).toBe(true);
  });

  test("存在しないルートは 404 を返す", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
  });
});
