---
layout: default
title: "I Built an AI Assistant for Under £5 per Month"
description: "Who needs a Mac Mini when you've got an old MacBook Air and some free API tokens?"
date: 2026-02-21
image: /assets/images/openclaw-budget-cover.png
categories:
  - openclaw
  - ai
  - self-hosting
---

_This post assumes you have a Discord account and aren't afraid of the terminal._

## The Problem: I Wanted an AI Assistant, Not a Second Mortgage

For the past couple of weeks, I've been playing around with [OpenClaw](https://openclaw.ai/), an open-source AI assistant framework that runs on your own machine. The idea appealed to me: a personal assistant that lives on my Mac, chats with me on Discord, and helps with everyday tasks.

I didn't want to spend hundreds of pounds on a new Mac Mini or a fancy GPU setup. I just wanted to see what was possible with what I already had. And I certainly didn't want to burn loads of money on API access to flagship API models.

## The Solution: Old Hardware, Free Tokens, and a Bit of Terminal Magic

As it turns out, you don't need much to get a decent AI assistant running. Here's what I used:

- **An old MacBook Air** — M2 chip, nothing fancy, I reformatted and created a new account
- **Ollama Cloud** — free API token that gives you access to decent models
- **Brave Search API** — also free, for web searching
- **Electricity** — basically the only ongoing cost

The setup was surprisingly straightforward. I won't go through every step (plenty of tutorials are available online) but the key insight was that I didn't need a powerful machine. The actual AI processing happens in the cloud via Ollama; my MacBook Air just handles the coordination.

One small trick: I set up _caffeinate_ to stop the Mac from sleeping. This way, my assistant is always available, even when the lid is closed:

```bash
caffeinate -d -i -s &
```

It's not the most elegant solution, but it works, and the electricity cost is negligible.

I say I set this up. In reality I just told my AI assistant to find a way to stop the computer from sleeping when the lid is closed. Because it runs locally on my own computer, it has access to do all the necessary things.

## What Can It Actually Do?

Here's where it gets fun. Over the past two weeks, my little assistant (who I've named _Clawby_ 🦞) has been helping out with:

- **Fetching my lunch menu** — every weekday at 9am, Clawby navigates to the online menu, translates it from Danish to English, formats it as markdown, and sends it to me via Discord. My colleagues now see it on the office noticeboard.
- **Good morning messages** — Clawby checks the weather and news, and sends me a morning update at 7am.
- **Flight searches** — when I was looking for a trip to London, Clawby used the browser tool to check prices on Kayak.
- **Widget updates** — one of my colleagues has a home screen widget that pulls from a secret gist. Clawby updates it with silly messages.

None of this required me to write code or set up complex workflows; I just _asked_ Clawby to do things in Discord.

## Defining Tasks Together

One of the most interesting parts of this experiment is how we define tasks. It's not like I wrote a specification document or created a ticket system. Instead, it's just... _conversation_.

- Hey, can you fetch the lunch menu from this URL every day at 9am?
- That's cool, can you translate it to English and skip the bread section?
- Can you format it as markdown for me so that I can easily copy and paste it?
- How about adding some emojis, that would look nice on the noticeboard.

Each request led to a small adjustment, and Clawby just... _got it_. We iterated together in real-time, and now I have a system that works exactly how I want it to.

I get Clawby to commit config and memories and push to a GitHub repo, partly for backup purposes, and partly so that I can see what Clawby is "thinking".

## The Social Part

What I didn't expect was that other people would want to join in. A few of my colleagues have popped into the Discord server, and now they chat with Clawby too. It's become a little shared space where we all play around with what an AI assistant can do.

## What Did I Learn?

I learned that you don't need expensive hardware to have a useful AI assistant. The heavy lifting happens in the cloud, and your local machine just needs to be _on_ and _connected_. The free tiers of Ollama and Brave give you enough to build something genuinely useful.

It's been really fun. There's something satisfying about asking your little assistant to do something and watching it figure out how to do it. We've been iterating on ideas together for two weeks now, and I'm still finding new things to try.

## Questions?

Are you interested in setting something similar up? I'm happy to answer questions. Reach out on Mastodon or LinkedIn (links below). I'd love to hear what you'd use an assistant for.

---

_You can find me on [Mastodon](https://tech.lgbt/@druewilding) or [LinkedIn](https://www.linkedin.com/in/druewilding/) if you'd like to continue the conversation._

_Thanks to my colleagues who've joined the Discord and made it more fun, you know who you are!_
