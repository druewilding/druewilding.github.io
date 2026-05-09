---
layout: default
title: "Cucumber Expressions: Actually readable step definitions"
description: From anchored regex nightmares to optional text and alternation — the evolution of Cucumber step matching
---

_This post assumes you're familiar with Cucumber and TypeScript._

I'm writing this post as much for my future self as for anyone else. I keep forgetting the exact syntax for optional plurals and alternation in Cucumber Expressions, so here's the definitive reference i wish i'd had years ago.

## The before times

When i first started using Cucumber, i was writing Ruby. Step definitions looked like this:

```ruby
When(/^the user "([^"]*)" logs in with password "([^"]*)"$/) do |username, password|
  login_page.login(username, password)
end
```

That `([^"]*)` is a capture group that matches any character except a double quote, zero or more times. It's not exactly welcoming, is it?

You also had to get the anchors right, with `^` at the start, and `$` at the end, otherwise the step might match things you didn't intend.

When i migrated to TypeScript (see [It's always been Cucumber](/2025/06/06/its-always-been-cucumber.html) for that journey), the regex habit came with me:

```typescript
When(
  /^the user "([^"]*)" logs in with password "([^"]*)"$/,
  async function (username: string, password: string) {
    await loginPage.login(username, password);
  }
);
```

Different language, same squinting required. The whole thing was a lot of ceremony for something that should have been readable.

## Cucumber Expressions arrive

Cucumber Expressions launched in September 2016, as a deliberate alternative to regular expressions. The idea was simple: make step definitions readable by people, not just by regex parsers.

The same step definition from above becomes:

```typescript
When(
  'the user {string} logs in with password {string}',
  async function (username: string, password: string) {
    await loginPage.login(username, password);
  }
);
```

Much better. The built-in parameter types available are:

| Expression | Matches                                         | TypeScript type            |
| ---------- | ----------------------------------------------- | -------------------------- |
| `{string}` | Quoted strings — `"like this"` or `'like this'` | `string` (quotes stripped) |
| `{int}`    | Integers — `42` or `-7`                         | `number`                   |
| `{float}`  | Decimal numbers — `3.14`                        | `number`                   |
| `{word}`   | A single word with no spaces                    | `string`                   |
| `{}`       | Anything at all                                 | `string`                   |

One thing worth noting about `{string}`: it matches the quoted value in your Gherkin and strips the quotes before passing it to your function. So if your scenario says:

```gherkin
When the user "admin" logs in with password "hunter2"
```

Then your function receives `admin` and `hunter2` — no quotes. This is almost always what you want.

## Handling plurals - optional text

For a long time, i didn't know this existed, so whenever i needed to match both singular and plural, i'd fall back to regex. Something like this:

```typescript
Given(
  /^I have (\d+) items? in the basket$/,
  async function (count: string) {
    await expect(basket.itemCount()).toBe(parseInt(count));
  }
);
```

That `items?` makes `s` optional in regex — the `?` means "zero or one of the preceding character". It works, but it's not as readable. Also, the regex treats everything as a string, which means i have to convert the `count` to a number in the step.

In Cucumber Expressions, parentheses mean _optional text_, which is a much more natural fit:

```typescript
Given(
  'I have {int} item(s) in the basket',
  async function (count: number) {
    await expect(basket.itemCount()).toBe(count);
  }
);
```

You can use parentheses around any optional text, not just `s`. Something like `I am logged in(to the application)` would match both `I am logged in` and `I am logged in to the application`. This can be useful sometimes.

## Irregular plurals — alternation syntax

The `(s)` trick works beautifully with most English nouns, but there are always exceptions, like the word "entry" becomes "entries" in plural.

This is where the `/` alternation syntax comes in. Added in March 2017, it lets you write two alternatives separated by a slash.

Before i knew about it, the regex would have looked something like this:

```typescript
Then(
  /^there (?:is|are) (\d+) entr(?:y|ies) in the list$/,
  async function (count: string) {
    await expect(entries).toHaveCount(parseInt(count));
  }
);
```

The regex uses `(?:...)` non-capturing groups because the thing being matched isn't actually relevant. All of this is an ugly mess.

With alternation in Cucumber Expressions:

```typescript
Then(
  'there is/are {int} entry/entries in the list',
  async function (count: number) {
    await expect(entries).toHaveCount(count);
  }
);
```

Matching:

```gherkin
Then there is 1 entry in the list
Then there are 117 entries in the list
```

Note that alternation is purely for matching — the alternatives aren't passed as parameters to your function. Only `{parameter_type}` syntax creates parameters. That's worth keeping in mind if you find yourself wanting to branch on which alternative was used; for that, you'd want a custom parameter type, which is what the next section is about.

## When you need even more — custom parameter types

There's one case where Cucumber Expressions on their own aren't quite enough: when you want the matched text to be transformed into something more useful than a string.

The `{string}` type gives you a string. The `{int}` type gives you a number. But what if you want a boolean? Or an enum?

I wrote about this in depth in [Using Cucumber Custom Parameter Types in TypeScript](/2025/09/12/using-cucumber-custom-parameter-types-in-typescript.html), using what i call the `shouldOrNot` pattern as an example. The short version: you can define your own `{shouldOrNot}` parameter type that converts `"should"` to `true` and `"should not"` to `false`, giving you a clean boolean in your step function instead of a string you have to check.

Alternation alone (`should/should not`) gives you the readability in the Gherkin. Custom parameter types give you the clean types in the TypeScript.

## A quick reference

In case this is the thing you actually came here for:

| Syntax       | Meaning                         | Example            |
| ------------ | ------------------------------- | ------------------ |
| `{string}`   | Quoted string (quotes stripped) | `the "admin" user` |
| `{int}`      | Integer                         | `42 items`         |
| `{float}`    | Decimal number                  | `3.14 seconds`     |
| `{word}`     | Single unquoted word            | `the red button`   |
| `(optional)` | Optional text                   | `item(s)`          |
| `this/that`  | Alternation                     | `enabled/disabled` |

## Looking back

I've been using Cucumber for years, and the introduction of Cucumber Expressions quietly removed one of the most common sources of friction. Regex step definitions still work, but it's always better to use a Cucumber Expression wherever possible.

Have you found any particularly elegant uses of optional text or alternation? i'd love to see examples from real test suites.

_You can find me on [Mastodon](https://tech.lgbt/@druewilding) or [LinkedIn](https://www.linkedin.com/in/druewilding/) if you'd like to continue the conversation._
