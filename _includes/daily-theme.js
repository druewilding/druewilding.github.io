// Daily colour theme.
//
// Takes today's colour from the daily-color package (loaded from jsDelivr just
// before this script, as window.DailyColor) and builds a full light + dark
// colour scheme from it, written as klods tokens. Runs inline in <head> so the
// page never paints in the wrong colours.
//
// Rules:
//   - hero:      today's exact hex, with black or white text (whichever reads better)
//   - accent:    same hue + chroma, lightness moved only as far as needed for 4.5:1
//   - secondary: the complementary hue (+180°), same contrast rule
//   - neutrals:  faintly tinted with today's hue (plain greys on grey days)
//
// Add ?date=YYYY-MM-DD to any URL to see another day. Like a dice roll, it
// lasts for the rest of the visit, until "back to today".
(function () {
  // ── From the daily-color package ────────────────────────────────────
  // If it didn't load, the site keeps its klods-css colours for this visit
  if (!window.DailyColor) return;
  var getDailyColor = DailyColor.getDailyColor;
  // OKLCH -> hex, with chroma brought down until the colour fits in sRGB
  var ok = DailyColor.oklch;
  // Black or white, whichever reads better on a colour
  var bestInk = DailyColor.contrastColor;
  // A colour from `start` lightness, made darker or lighter (away from bg)
  // until it reads on bg at 4.5:1
  function findLight(start, C, H, bg) {
    return DailyColor.readableOn({ l: start, c: C, h: H }, bg);
  }
  function hex2(n) {
    return n.toString(16).padStart(2, "0");
  }

  // ── The scheme ──────────────────────────────────────────────────────────
  function dailyScheme(hex) {
    var o = DailyColor.toOklch(hex);
    var L = o.l;
    var C = o.c;
    var H = o.h;
    var tint = C < 0.04 ? 0 : Math.min(C, 0.12);
    var accC = Math.min(C, 0.2);
    var H2 = (H + 180) % 360;
    var secC = Math.min(Math.max(C, 0.11), 0.17);
    var hero = {
      hero: hex,
      "hero-2": ok(L > 0.6 ? L - 0.07 : L + 0.08, C, (H + 35) % 360),
      "on-hero": bestInk(hex),
    };

    var lbg = ok(0.985, tint * 0.1, H);
    var light = {
      bg: lbg,
      surface: ok(0.958, tint * 0.22, H),
      "surface-2": ok(0.93, tint * 0.26, H),
      border: ok(0.895, tint * 0.3, H),
      fg: ok(0.24, tint * 0.18, H),
      muted: ok(0.5, tint * 0.2, H),
      accent: findLight(Math.min(L, 0.68), accC, H, lbg),
      secondary: findLight(Math.min(L, 0.62), secC, H2, lbg),
    };
    light["on-accent"] = bestInk(light.accent);

    var dbg = ok(0.185, tint * 0.14, H);
    var dark = {
      bg: dbg,
      surface: ok(0.228, tint * 0.2, H),
      "surface-2": ok(0.27, tint * 0.22, H),
      border: ok(0.32, tint * 0.25, H),
      fg: ok(0.94, tint * 0.08, H),
      muted: ok(0.74, tint * 0.15, H),
      accent: findLight(Math.max(L, 0.55), accC, H, dbg),
      secondary: findLight(Math.max(L, 0.6), secC, H2, dbg),
    };
    dark["on-accent"] = bestInk(dark.accent);

    var codeC = Math.min(Math.max(C, 0.12), 0.16);
    Object.assign(light, codeColours(ok(0.962, tint * 0.2, H), light.fg, H, codeC, tint, 0.6));
    Object.assign(dark, codeColours(ok(0.15, tint * 0.14, H), dark.fg, H, codeC, tint, 0.72));

    return { hex: hex, hero: hero, light: light, dark: dark };
  }

  // Code highlighting: six hues spaced evenly round the colour wheel, starting
  // from today's, so keywords are today's colour and strings its complement.
  // Each one gets the same contrast rule as links.
  function codeColours(bg, fg, H, C, tint, start) {
    function hue(turn) {
      return findLight(start, C, (H + turn) % 360, bg);
    }
    var tag = hue(300);
    return {
      "code-bg": bg,
      "code-fg": fg,
      "code-keyword": hue(0),
      "code-title": hue(60),
      "code-number": hue(120),
      "code-string": hue(180),
      "code-type": hue(240),
      "code-attr": tag,
      "code-tag": tag,
      "code-comment": findLight(start, tint * 0.2, H, bg),
    };
  }

  // ── Write as klods tokens ───────────────────────────────────────────────
  var TOKENS = {
    bg: "--klods-color-bg",
    surface: "--klods-color-surface",
    "surface-2": "--klods-color-surface-2",
    border: "--klods-color-border",
    fg: "--klods-color-fg",
    muted: "--klods-color-muted",
    accent: "--klods-color-accent",
    "on-accent": "--klods-color-accent-fg",
    secondary: "--drue-secondary",
    hero: "--drue-hero",
    "hero-2": "--drue-hero-2",
    "on-hero": "--drue-on-hero",
  };
  ["bg", "fg", "keyword", "title", "number", "string", "type", "attr", "tag", "comment"].forEach(function (k) {
    TOKENS["code-" + k] = "--klods-code-" + k;
  });
  function decls(s) {
    return Object.keys(s)
      .map(function (k) {
        return TOKENS[k] + ":" + s[k] + ";";
      })
      .join("");
  }

  var date = new Date();
  var todayHex = getDailyColor(date);

  // A colour you chose lasts until the tab is closed. It's either a rolled
  // colour from the dice ("#36fed0") or another day's ("2026-12-25", from
  // ?date= in the address, e.g. via the colour calendar).
  var CHOICE_KEY = "drue-colour-choice";
  function readChoice() {
    try {
      return sessionStorage.getItem(CHOICE_KEY);
    } catch {
      return null;
    }
  }
  function writeChoice(value) {
    try {
      if (value) sessionStorage.setItem(CHOICE_KEY, value);
      else sessionStorage.removeItem(CHOICE_KEY);
    } catch {
      // Storage blocked: the colour still changes, it just won't follow you
    }
  }

  // Turns a choice into { hex, when, date }, or null for today's colour
  function resolve(choice) {
    if (/^#[0-9a-f]{6}$/.test(choice)) return { hex: choice, when: "right now", verb: "is", date: null };
    var d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(choice || "");
    if (!d) return null;
    var day = new Date(+d[1], +d[2] - 1, +d[3]);
    if (day.toDateString() === date.toDateString()) return null;
    return {
      hex: getDailyColor(day),
      when: dayName(day),
      // "on 1 Mar the site was", "on 25 Dec the site will be"
      verb: day < date ? "was" : "will be",
      date: day,
    };
  }

  // "yesterday", "tomorrow", or "on 25 Dec"
  function dayName(day) {
    var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var days = Math.round((day - midnight) / 86400000);
    if (days === -1) return "yesterday";
    if (days === 1) return "tomorrow";
    return "on " + day.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }

  var m = /[?&]date=(\d{4}-\d{2}-\d{2})/.exec(location.search);
  if (m) writeChoice(m[1]);

  var style = document.createElement("style");
  style.id = "daily-theme";
  document.head.appendChild(style);

  // The browser tab icon: my initials on a little tile in today's colours.
  // Added after the PNG icons, so browsers that understand SVG icons use it.
  // (Icons can't load web fonts, so the letters use the system's bold sans.)
  var favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/svg+xml";
  document.head.appendChild(favicon);

  function faviconFor(hero) {
    var svg =
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
      "<stop offset='.4' stop-color='" +
      hero.hero +
      "'/><stop offset='1' stop-color='" +
      hero["hero-2"] +
      "'/></linearGradient></defs>" +
      "<rect width='32' height='32' rx='8' fill='url(#g)'/>" +
      "<text x='15.2' y='15.65' text-anchor='middle' dominant-baseline='central' " +
      "font-family='Helvetica Neue, Helvetica, Arial, sans-serif' font-weight='800' " +
      "font-size='15' letter-spacing='-0.6' fill='" +
      hero["on-hero"] +
      "'>DW</text></svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function apply(choice) {
    var chosen = resolve(choice);
    var hex = chosen ? chosen.hex : todayHex;
    var scheme = dailyScheme(hex);
    // --drue-accent-light is the light-mode accent in every mode, for pages that
    // are always light, like the CV (it's white paper even in dark mode)
    var light = decls(scheme.light) + decls(scheme.hero) + "--drue-accent-light:" + scheme.light.accent + ";";
    var dark = decls(scheme.dark) + decls(scheme.hero);
    style.textContent =
      ":root{" +
      light +
      "}" +
      "@media screen and (prefers-color-scheme: dark){:root:not([data-theme=light]){" +
      dark +
      "}}" +
      ":root[data-theme=dark]{" +
      dark +
      "}";

    var meta = document.querySelector("meta[name=theme-color]");
    if (meta) meta.setAttribute("content", hex);
    favicon.href = faviconFor(scheme.hero);

    document.documentElement.toggleAttribute("data-shuffled", Boolean(chosen));
    document.querySelectorAll("[data-daily-hex]").forEach(function (el) {
      el.textContent = hex;
    });
    document.querySelectorAll("[data-daily-when]").forEach(function (el) {
      el.textContent = chosen ? chosen.when : "today";
    });
    document.querySelectorAll("[data-daily-verb]").forEach(function (el) {
      el.textContent = chosen ? chosen.verb : "is";
    });

    window.dailyTheme.choice = chosen ? choice : null;
    window.dailyTheme.chosenDate = chosen ? chosen.date : null;
    window.dailyTheme.hex = hex;
    window.dailyTheme.scheme = scheme;
  }

  // Crossfade the whole page to the new scheme, so everything changes together
  // (a view transition). Browsers without it, and reduced motion, just switch.
  function change(choice) {
    var update = function () {
      apply(choice);
    };
    if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(update);
    } else {
      update();
    }
  }

  function randomHex() {
    var channel = function () {
      return hex2(Math.floor(Math.random() * 256));
    };
    return "#" + channel() + channel() + channel();
  }

  window.dailyTheme = {
    today: todayHex,
    hex: todayHex,
    date: date,
    // For the colour calendar: any day's colour, and black or white to go on it
    colourFor: getDailyColor,
    inkFor: bestInk,
    shuffle: function () {
      var hex = randomHex();
      writeChoice(hex);
      change(hex);
      return hex;
    },
    reset: function () {
      writeChoice(null);
      change(null);
    },
  };

  apply(m ? m[1] : readChoice());

  document.addEventListener("DOMContentLoaded", function () {
    // Fill in text that wasn't in the page yet when the theme was applied
    apply(window.dailyTheme.choice);
    document.querySelectorAll("[data-theme-shuffle]").forEach(function (button) {
      button.addEventListener("click", window.dailyTheme.shuffle);
    });
    document.querySelectorAll("[data-theme-reset]").forEach(function (button) {
      button.addEventListener("click", window.dailyTheme.reset);
    });
  });
})();
