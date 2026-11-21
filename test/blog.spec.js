import { expect, test } from "@playwright/test";

test.describe("blog", () => {
  test("opens the newest post from the blog page", async ({ page }) => {
    await page.goto("/blog/");

    const newest = page.locator(".post-card--feature");
    const title = (await newest.locator(".post-card__title").textContent()).trim();
    await newest.click();

    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Blog" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("lists the posts in the Cucumber series", async ({ page }) => {
    await page.goto("/blog/cucumber/");
    expect(await page.locator(".post-card").count()).toBeGreaterThan(1);
  });

  test("has a feed with posts in it", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain("<entry>");
  });
});

test.describe("404 page", () => {
  test("answers a missing page with a 404 and a tiny adventure", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist/");
    expect(response.status()).toBe(404);

    await page.getByLabel("What now?").fill("look");
    await page.getByLabel("What now?").press("Enter");
    await expect(page.locator("#adventure-log")).toContainText("small, quiet room");
  });
});
