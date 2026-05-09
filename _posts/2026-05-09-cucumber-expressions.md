---
layout: default
title: "Cucumber Expressions: Readable step definitions"
description: From anchored regex nightmares to optional text and alternation — the evolution of Cucumber step matching
---

_This post assumes you're familiar with Cucumber and TypeScript._

I'm writing this post as much for my future self as for anyone else. I keep forgetting the exact syntax for optional plurals and alternation in Cucumber Expressions, so here's the definitive reference i wish i'd had years ago.

## The before times

When i first started using Cucumber, i was writing Ruby. Step definitions used regular expressions, and looked like this:

```ruby
When(/^the user "([^"]*)" logs in with password "([^"]*)"$/) do |username, password|
  login_page.login(username, password)
end
```

That `([^"]*)` is a capture group that matches any character except a double quote, zero or more times. It's not exactly welcoming, is it?

You also had to get the anchors right, with `^` at the start, and `$` at the end, otherwise the step might match things you didn't intend.

When i migrated to TypeScript, the regex habit came with me:

```typescript
When(/^the user "([^"]*)" logs in with password "([^"]*)"$/, async function (username: string, password: string) {
  await loginPage.login(username, password);
});
```

Different language, same squinting required. The whole thing was a lot of ceremony for something that should have been readable.

## Cucumber Expressions arrive

Cucumber Expressions launched in September 2016, as a friendlier alternative to regular expressions. The idea was simple: make step definitions readable by people, not just by regex parsers.

The same step definition from above becomes:

```typescript
When("the user {string} logs in with password {string}", async function (username: string, password: string) {
  await loginPage.login(username, password);
});
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

Then your function receives `admin` and `hunter2` without quotes, which is almost always what you want.

## Handling plurals with optional text

For a long time, i didn't know this existed, so whenever i needed to match both singular and plural, i'd fall back to regex. Something like this:

```typescript
Given(/^I have (\d+) items? in the basket$/, async function (count: string) {
  await expect(basket.itemCount()).toBe(parseInt(count));
});
```

That `items?` makes `s` optional in regex — the `?` means "zero or one of the preceding character". It works, but it's not as readable. Also, the regex treats everything as a string, which means i have to convert the `count` to a number in the step.

In Cucumber Expressions, parentheses mean _optional text_, which is a much more natural fit:

```typescript
Given("I have {int} item(s) in the basket", async function (count: number) {
  await expect(basket.itemCount()).toBe(count);
});
```

Matching:

```gherkin
Given I have 1 item in the basket
Given I have 3 items in the basket
```

You can use parentheses around any optional text, for example:

```typescript
Given("I am logged in( to the app)", async function () {
  await expect(homePage.welcomeMessage()).toBeVisible();
});
```

Matching:

```gherkin
Given I am logged in
Given I am logged in to the app
```

Both resolve to the same step function, which can be useful in some situations.

## Irregular plurals with alternation syntax

The `(s)` trick works beautifully with most English nouns, but there are always exceptions, like the word "entry" becomes "entries" in plural.

This is where alternation syntax comes in. Added in March 2017, it lets you write two alternatives separated by a slash.

Before i knew about it, i would be writing ugly regex, something like this:

```typescript
Then(/^there (?:is|are) (\d+) entr(?:y|ies) in the list$/, async function (count: string) {
  await expect(entries).toHaveCount(parseInt(count));
});
```

The regex uses `(?:...)` for non-capturing groups, since the thing being matched isn't actually relevant. All of this is a mess.

With alternation in Cucumber Expressions:

```typescript
Then("there is/are {int} entry/entries in the list", async function (count: number) {
  await expect(entries).toHaveCount(count);
});
```

Matching:

```gherkin
Then there is 1 entry in the list
Then there are 117 entries in the list
```

Note that alternation is purely for matching — the alternatives aren't passed as parameters to your function. Only `{}` syntax creates parameters. That's worth keeping in mind if you find yourself wanting to branch on which alternative was used; for that, you want a custom parameter type.

## When you need even more — custom parameter types

There's one case where Cucumber Expressions on their own aren't quite enough: when you want the matched text to be transformed into something more useful than a string.

The `{string}` type gives you a string. The `{int}` type gives you a number. But what if you want a boolean? Or an enum?

I wrote about this in depth in [Using Cucumber Custom Parameter Types in TypeScript](/2025/09/12/using-cucumber-custom-parameter-types-in-typescript.html), using what i call the `shouldOrNot` pattern as an example. The short version: you can define your own `{shouldOrNot}` parameter type that converts `"should"` to `true` and `"should not"` to `false`, giving you a clean boolean in your step function instead of a string you have to check.

Alternation alone gives you the readability in the Gherkin. Custom parameter types give you the clean types in the TypeScript.

For an enum, the pattern is the same — define a parameter type with a regexp that lists the allowed values, and a transformer that converts the matched string into the enum value:

```typescript
enum Status {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}

defineParameterType({
  name: "status",
  regexp: /draft|published|archived/,
  transformer: (s: string) => s as Status,
});
```

Now you can write:

```typescript
Then("the {string} entry should be {status}", async function (title: string, status: Status) {
  const entry = page.getByRole("row", { name: title });
  await expect(entry.getByTestId("status")).toHaveText(status);
});
```

```gherkin
Then the "Hello World" entry should be draft
Then the "Release Notes" entry should be published
```

Your step function gets a proper `Status` enum value rather than a raw string, which means TypeScript will tell you if you accidentally handle a status that doesn't exist.

## Looking back

I've been using Cucumber for years, and the introduction of Cucumber Expressions quietly removed one of the most common sources of friction. Regex step definitions still work, but i can't think of a reason i'd reach for one now.

Have you found any particularly elegant uses of optional text or alternation? i'd love to see examples from real test suites.

_You can find me on [Mastodon](https://tech.lgbt/@druewilding) or [LinkedIn](https://www.linkedin.com/in/druewilding/) if you'd like to continue the conversation._
