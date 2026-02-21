---
layout: default
title: "i built an AI assistant for under £5/month — on a 10-year-old macbook"
description: "who needs a mac mini when you've got an old air and some free api tokens?"
date: 2026-02-21
image: /assets/images/openclaw-budget-cover.png
categories:
  - openclaw
  - ai
  - self-hosting
---

_this post assumes you have a discord account and aren't afraid of the terminal_

## the problem: i wanted an ai assistant, not a second mortgage

for the past couple of weeks, i've been playing around with _openclaw_ — an open-source ai assistant framework that runs on your own machine. the idea appealed to me: a personal assistant that lives on my mac, chats with me on discord, and helps with everyday tasks.

but here's the thing — i didn't want to spend hundreds of pounds on a new mac mini or a fancy gpu setup. i just wanted to see what was possible with what i already had.

## the solution: old hardware, free tokens, and a bit of terminal magic

turns out, you don't need much to get a decent ai assistant running. here's what i used:

- **an old macbook air** (about 10 years old, m2 chip — nothing fancy)
- **ollama cloud** — free api token that gives you access to decent models
- **brave search api** — also free, for web searching
- **electricity** — basically the only ongoing cost

the setup was surprisingly straightforward. i won't bore you with every step — the openclaw docs cover that — but the key insight was that i didn't need a beefy machine. the actual ai processing happens in the cloud via ollama, so my little air just handles the coordination.

### keeping the lights on

one small trick: i set up _caffeinate_ to stop the mac from sleeping. this way, my assistant is always available, even when the lid is closed:

```bash
caffeinate -d -i -s &
```

it's not the most elegant solution, but it works — and the electricity cost is negligible.

## what can it actually do?

here's where it gets fun. over the past two weeks, my little assistant (who i've named _clawby_ 🦞) has been helping out with:

- **fetching my lunch menu** — every weekday at 9am, clawby navigates to the riz raz menu, translates it from danish to english, and sends it to me via discord. my colleagues now see it on the office noticeboard
- **good morning messages** — clawby checks the weather and news, then sends me a morning update at 7am
- **flight searches** — when i was looking for a trip to london, clawby used the browser tool to check prices on kayak
- **widget updates** — one of my colleagues has a home screen widget that pulls from a secret gist. clawby updates it with silly messages

none of this required me to write code or set up complex workflows — i just _asked_ clawby to do things in discord.

## defining tasks together

one of the most interesting parts of this experiment is how we define tasks. it's not like i wrote a specification document or created a ticket system. instead, it's just... _conversation_.
"hey, can you fetch the menu every day at 9am?"  
"cool, can you translate it to english and skip the bread section?"  
"actually, let's add emojis — that would look nice on the noticeboard"

each request led to a small adjustment, and clawby just... _got it_. we iterated together in real-time, and now i have a system that works exactly how i want it to.

## the social part

what i didn't expect was that other people would want to join in. a couple of my colleagues have popped into the discord server, and now they chat with clawby too. one of them has his own home screen widget powered by the same gist system. it's become a little shared space where we all play around with what an ai assistant can do.

## what did i learn?

honestly? that you don't need expensive hardware to have a useful ai assistant. the heavy lifting happens in the cloud, and your local machine just needs to be _on_ and _connected_. the free tiers of ollama and brave give you enough to build something genuinely useful.

and honestly? it's been _fun_. there's something satisfying about asking your little assistant to do something and watching it figure out how to do it. we've been iterating on ideas together for two weeks now, and i'm still finding new things to try.

## questions?

interested in setting something similar up? happy to answer questions — reach out on mastodon or linkedin (links below). i'd love to hear what you'd use an assistant for.

---

_You can find me on [Mastodon](https://tech.lgbt/@druewilding) or [LinkedIn](https://www.linkedin.com/in/druewilding/) if you'd like to continue the conversation._

_thanks to my colleagues who've joined the discord and made it more fun — you know who you are._
