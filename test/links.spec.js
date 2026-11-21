import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

// The main pages: each should load without JavaScript errors, and every link
// and image on it that points at this site should work.
const PAGES = ["/", "/blog/", "/blog/cucumber/", "/colours/", "/cv/", "/cv/da/"];

// Projects like /klods/ live in their own repos and share the domain on GitHub
// Pages, so they don't exist when this site runs locally
const OTHER_REPOS = [...readFileSync("_data/projects.yml", "utf8").matchAll(/^\s+url: (\/\S+)$/gm)].map(
  (match) => match[1]
);

for (const path of PAGES) {
  test(`${path} has no errors or broken links`, async ({ page, request, baseURL }) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(path);
    expect(response.ok()).toBe(true);

    const urls = await page.evaluate(() =>
      [...document.querySelectorAll("a[href], img[src]")].map((el) => el.href || el.src)
    );
    const internal = [
      ...new Set(
        urls
          .map((url) => new URL(url))
          .filter((url) => url.origin === baseURL && !OTHER_REPOS.some((repo) => url.pathname.startsWith(repo)))
          .map((url) => url.pathname)
      ),
    ];

    const broken = [];
    for (const url of internal) {
      const res = await request.get(url);
      if (!res.ok()) broken.push(`${res.status()} ${url}`);
    }

    expect(broken, "broken links").toEqual([]);
    expect(errors, "JavaScript errors").toEqual([]);
  });
}
