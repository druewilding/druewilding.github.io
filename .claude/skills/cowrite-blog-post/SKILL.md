---
name: cowrite-blog-post
description: Co-write a blog post for druewilding.com with Drue. Use when Drue wants to write a new post, asks to be "grilled" about a post, or wants help planning, drafting, illustrating or polishing one. Covers the interview, the outline, the screenshots and the edit rounds.
---

# Co-writing a blog post with Drue

The post is Drue's: their story, their opinions, their voice. Your job is to draw the story out, check the facts, make the pictures and write a draft that Drue then nudges into shape. The blog rules in `.copilot/rules/blog-post-rules.md` and the site's `.claude/CLAUDE.md` still apply; this skill is how to work _together_.

## 1. Look before you ask

Before the first question, read:

- The two or three most recent posts in `_posts/`, for the current voice, length and how images are used
- The README sections on front matter, images, tags and series
- Any repo, docs or changelog the post is about, so your questions are specific (versions, dates, what landed when)

## 2. Grill Drue, in rounds

Ask in numbered rounds of about 10 short questions, so Drue can answer with just the numbers. Under each question, give your guess or a few options, so a one-word answer ("b", "yes", "agree") is enough. Then do a bit of research, and ask the next round with the specifics you found.

Things worth asking about:

- **Audience:** who it's for, and how much how-to they need
- **Shape:** one post or a series, and roughly how long
- **The hook:** why Drue made the thing, in their own words, however messy
- **The name, the analogy, the principles:** what they mean to Drue, and how strongly to lean on them
- **What to leave out:** AI, people, things that were taken down
- **Examples and case studies:** which ones, and how deep
- **Pictures:** what to show, before/after, and who takes them
- **The ending:** an invitation, a reflection, what's next
- **The title**

End the grilling with a full outline (sections, what goes in each, which pictures go where) and a last handful of open questions. Only start writing once Drue has answered them.

## 3. Write only what's true

Drue's corrections from earlier posts all come down to one thing: don't put words in their mouth.

- **No made-up anecdotes or feelings.** Not "I checked!", not "i half expected…", not "i always forget, too". If you want a personal touch, ask for it.
- **No made-up promises.** Only claim what the thing really does. For example, don't promise autocompletion.
- **Give the right credit.** Say exactly what a tool did. A layout library makes spacing and padding consistent; it didn't come up with a better page design.
- **Describe only what the picture shows.** If a button isn't in the screenshot, don't list it.
- **Use the present tense for how Drue works now:** "i need", not "i needed".
- **Say what Drue does, not "the one rule i stick to".** Describe the habit plainly.
- **Don't mention AI** unless Drue asks for it in this post.
- **Ask how to name people.** For example, Drue's sibling is "Luna" or "my sibling Luna" where Drue chooses, and "friends and family" otherwise.
- **Explain jargon briefly** (e.g. what BEM stands for). Drue likes the reminder too.

Check facts against the source (code, git history, changelogs, live sites), not against memory. If you rendered or ran something to check a claim, you can say it's true, but don't write that _Drue_ checked it.

## 4. Writing style

- **Drue's voice:** a lowercase "i", British spelling, warm, plain and a little playful
- **Headings:** short and plain. "Demo" beats "The same brick, three ways"; "Segmented control" beats "The segmented control"
- **Wording:** take out filler and clunky clauses. Prefer "If you'd rather choose, add…" over "You can still choose: … picks one and sticks to it"
- **Lists:** two or more parallel links or options go in bullet points, not one long sentence
- **Links:** keep the link text short so it doesn't wrap across lines ("[the redesign](…) last week", not the whole title of a post). Link every project the first time it's mentioned
- **CDN snippets:** use a major-version range (`pkg@2`), so readers get fixes but not breaking changes
- **Long posts:** if the `###` sections matter, set `toc_depth: 3` in the front matter
- **The ending:** invite readers to GitHub issues or Mastodon, but don't add a contact sign-off (the Mastodon box is automatic)

## 5. Pictures

Take the screenshots yourself with Playwright, using the real Google Chrome (`channel: "chrome"`). Its bundled Chromium can hang on some sites. Put the screenshot scripts and raw PNGs in the scratchpad, and save the finished JPEGs in `assets/images/<post-slug>/`.

- **Light mode by default.** Ask whether a site looks better in dark (chess does).
- **Show the thing doing its thing:** paint a blob on a painting app, turn on a switch, start a game so "Your move" appears. An empty canvas or an all-off form doesn't explain anything.
- **Fit the window to the content:** a narrower window for a single component, so it isn't stretched across 1400px, and a taller one if the crop needs to go below the fold. Screenshot an element, or clip to it, rather than the whole page.
- **Use the docs for component variants:** a screenshot of the docs example (e.g. every status colour) beats describing them.
- **Show old versions without touching the repo:** `git archive <commit> | tar -x -C <scratchpad dir>`, then serve that folder. Never switch branches or edit Drue's working copies. (For chess, copy `js/firebase-config.js` into the copy. Never overwrite the original.)
- **The cover image** (`og-image.jpg`) is 1200×630 JPEG, and is also the picture at the top of the post:
  - Render it straight at that size, from a small HTML page.
  - For a collage, crop out each screenshot's empty margins, centre each site's main content, and give tiles a little shadow.
  - Put the background on a soft gradient (dots on top are nice), not a flat grey that looks like a missing image.
- **Size and alt text:** JPEG, about 1600px wide at most, `sips` for converting and resizing. Write alt text that describes what's actually in the picture.

Look at every image before using it (Read the file). Then look at the built post at desktop and phone widths.

## 6. Edit rounds

Drue sends nudges one at a time. For each one:

- Make exactly that change, plus anything it forces nearby. For example, if you remove a sentence, fix the lead-in of the next one. Say what you touched.
- Edit with exact string replacements, and check the result with a quick `grep` or `sed -n`.
- Quote the new wording back in your reply, so Drue can see it without opening the file.
- If Drue asks a question ("is it true that…?"), answer it honestly, then suggest a fix.
- When there's an obvious best option, apply it and mention the alternative in one line. Don't ask first.

## 7. Finishing

- Run `npx prettier --check .`, `npx eslint` and `npm test` (load Node with fnm and Ruby with rvm first). Rebuild with `bundle exec jekyll build`, then check the post for broken images and sideways scrolling.
- Mention anything you noticed in _other_ repos (docs typos, version drift), but don't change them.
- Never commit. Suggest a conventional commit message, e.g. `feat: Add a blog post about building klods, my own CSS component library`.
