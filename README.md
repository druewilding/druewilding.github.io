# druewilding.github.io

- [Portfolio](https://www.druewilding.com/)
- [Blog](https://www.druewilding.com/blog/)
- [CV](https://www.druewilding.com/cv/) ([på dansk](https://www.druewilding.com/cv/da/))

A Jekyll site on GitHub Pages, with its own theme built on [klods-css](https://www.npmjs.com/package/klods-css). The whole site changes colour every day, using the same colour as [Daily Color](https://www.druewilding.com/daily-color/).

## Running locally

### Setup

    rvm use ruby-3.1.2@blog --create
    bundle install

If you experience `fatal error: 'openssl/ssl.h' file not found`

    brew install openssl
    bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include

If you then experience `rubymain.cpp:220:3: warning: 'rb_rescue' is deprecated: Use of ANYARGS in this function is deprecated` add another flag

    bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl)/include --with-openssl-dir=$(brew --prefix openssl)

If you experience `Error running '__rvm_make -j10'`

    rvm install ruby-3.1.2 --with-openssl-dir=$(brew --prefix openssl@3)

Then try again

### Run the Jekyll server

    rvm use ruby-3.1.2@blog
    npm run start

Visit http://localhost:4000

### Checks

    npm run format:check
    npm run lint:check

`npm run format` and `npm run lint` fix what they can. Liquid templates are skipped by Prettier (see `.prettierignore`).

GitHub Pages builds the site itself, with an older Jekyll (3.10) and only these plugins: jekyll-paginate, jekyll-seo-tag and jekyll-feed. Anything else has to be plain Liquid.

## Writing a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-some-title.md`:

```yaml
---
layout: post
title: "The title"
description: One line for the header, cards and link previews
image: https://www.druewilding.com/assets/images/some-title/og-image.jpg
tags: [testing, ai]
---
```

| Front matter  | What it does                                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | The big heading, and the title everywhere else                                                                                                                  |
| `description` | Shown under the title, on blog cards and in link previews                                                                                                       |
| `image`       | The cover image and the link preview picture. Use the full `https://www.druewilding.com/…` address, and JPEG (some social sites don't show WebP)                |
| `tags`        | Any of the tags in `_data/tags.yml`                                                                                                                             |
| `series`      | Adds the post to a series in `_data/series.yml`, e.g. `series: cucumber`. Posts are numbered by date                                                            |
| `mastodon`    | The address of a toot about the post. The box at the end becomes "Reply on Mastodon" and links to the thread. Without it, the box links to the Mastodon profile |
| `toc`         | `false` hides the "In this post…" list                                                                                                                          |
| `toc_depth`   | `3` includes the `###` sub-sections in the list (the crochet dog ball uses this for its rounds)                                                                 |

### Headings

- Use `##` for sections and `###` for sub-sections. Never `#`: the title is already the page's main heading.
- Write them in sentence case: "Handling plurals with optional text", not "Handling Plurals With Optional Text".
- Posts with four or more sections get an "In this post…" list automatically, and every heading gets a `#` link that copies its address.

### Images

Put them in `assets/images/<post-name>/`. Keep them small:

- Screenshots and photos as JPEG, no wider than about 1600px (photos up to 2000px).
- Screenshots with transparency as WebP.

For example, with ImageMagick:

    magick input.png -resize '1600x1600>' -quality 82 output.jpg

An image on a line of its own goes a little wider than the text.

### Code

Fenced code blocks get syntax highlighting in today's colours. Name the language after the backticks (` ```typescript `, ` ```gherkin `, ` ```bash `…).

### Tags and series

- **New tag:** add it to `_data/tags.yml`, then copy a page in `blog/tag/` and change the slug. GitHub Pages can't generate tag pages by itself.
- **New series:** add it to `_data/series.yml`, then make its page by copying `blog/cucumber/index.html`.

## The homepage

- **Projects** (Things i've made) live in `_data/projects.yml`, in groups. The comments at the top explain the options. Images go in `assets/images/portfolio/`.
- **Find me elsewhere** comes from `_data/elsewhere.yml`, and so do the links in the footer.

## The daily colour

`_includes/daily-theme.js` runs in the `<head>` of every page. It works out today's colour, then builds a full light and dark colour scheme from it, so every bit of text stays readable (WCAG 4.5:1 contrast). It writes the scheme as CSS custom properties before the page appears, so there's no flash of the wrong colours. The rest of the styling is in `assets/css/site.css`.

- **A year in colour** at `/colours/` (`colours.html` and `assets/js/colour-calendar.js`) shows every day as a coloured square. The "today the site is…" pill links to it.
- **See another day:** add `?date=2026-12-25` to any address. Like a dice roll, the chosen day sticks while you browse, until "back to today".
- **The dice button** rolls a random colour for the rest of the visit. "back to today" puts it back.
- **The CV** uses today's colour on screen only. When printed it's always the same.
