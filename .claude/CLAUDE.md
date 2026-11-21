# druewilding.github.io

Drue's portfolio, blog and CV. Jekyll on GitHub Pages with a custom theme on klods-css, recoloured every day from Daily Color. The README explains the front matter options, data files, images and the daily colour; read it before changing posts or templates.

## Writing in Drue's voice

Follow the blog writing rules, which also apply to any text on the site (buttons, notes, descriptions):

@../.copilot/rules/blog-post-rules.md

On top of those:

- One-sentence descriptions (project tiles, cards) have no full stop at the end.
- Change only what was asked. Drue's words in posts are Drue's: suggest edits to wording rather than making them.

## Working on the site

- **Never commit.** Drue makes every commit. When a piece of work is done, suggest a conventional commit message with a capitalised description, e.g. `feat: Add a reply-on-Mastodon box to the end of every post`.
- **GitHub Pages limits.** The live build uses Jekyll 3.10 (locally it's 4.x) and only jekyll-paginate, jekyll-seo-tag and jekyll-feed. Templates must be plain Liquid; no custom plugins.
- **Run the checks** before calling something done: `npx prettier --check .`, `npx eslint` and `npm test` (Playwright, in `test/`). Liquid templates are in `.prettierignore` because Prettier can't parse them.
- **Look at it.** Check visual changes in a real browser at a wide, a medium and a phone width (390px), in light and dark mode, and make sure nothing scrolls sideways.
- **Colours come from tokens.** Use the klods tokens (`--klods-color-*`) and the site's `--drue-*` tokens, never fixed colours, so everything follows the daily colour. Any change to the colour maths in `_includes/daily-theme.js` must keep every day (and random dice colours) at 4.5:1 contrast or better, in both modes; test across at least two years of dates.
- **The CV's print layout must not change.** Screen-only styles go inside `@media screen`. After touching the CV, compare print renders before and after.
- **No `!important`.** Use specificity or a media query instead.
- **Images:** JPEG (WebP only for transparency), resized as the README says. Social preview images stay JPEG at 1200×630. Screenshots for blog posts are taken in light mode.
