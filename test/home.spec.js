import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("shows the name and the latest three posts", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Drue Wilding" })).toBeVisible();

    const latest = page.locator("section", { has: page.getByRole("heading", { name: "Latest from the blog" }) });
    await expect(latest.locator(".post-card")).toHaveCount(3);
  });

  test("shows the things i've made", async ({ page }) => {
    const made = page.locator("#made");
    await expect(made.getByRole("heading", { name: "Things i've made" })).toBeVisible();
    await expect(made.getByRole("link", { name: /klods/ })).toBeVisible();
  });

  test("wears today's colour", async ({ page }) => {
    await expect(page.locator("[data-daily-hex]").first()).toHaveText(/^#[0-9a-f]{6}$/);
  });

  test("nav links go to the blog and the CV", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main" });

    await nav.getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL(/\/blog\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();

    await page.goBack();
    await nav.getByRole("link", { name: "CV" }).click();
    await expect(page).toHaveURL(/\/cv\/$/);
  });
});
