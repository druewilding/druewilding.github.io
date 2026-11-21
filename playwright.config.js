import { defineConfig, devices } from "@playwright/test";

// Builds the site with Jekyll and serves it on its own port, so the tests can
// run while `npm run dev` is using port 4000.
const PORT = 4100;

export default defineConfig({
  testDir: "test",
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `bundle exec jekyll serve --port ${PORT} --no-watch`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
