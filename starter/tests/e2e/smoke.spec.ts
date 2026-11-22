import { expect, test } from "@playwright/test";

test("root redirects to the default locale and renders the home page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("admin pages are not indexable", async ({ page }) => {
  await page.goto("/en/admin");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("robots, sitemap and llms.txt are served", async ({ request }) => {
  for (const path of ["/robots.txt", "/sitemap.xml", "/llms.txt"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
  }
});
