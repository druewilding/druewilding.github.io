// A very small text adventure for the 404 page.
// Without JavaScript the form stays hidden and the shortcut links still work.

(function () {
  const log = document.getElementById("adventure-log");
  const form = document.getElementById("adventure-form");
  const input = document.getElementById("adventure-input");
  if (!log || !form || !input) return;

  // Looked up every time, because the dice can change the colour mid-game
  const theme = window.dailyTheme;
  const hex = () => (theme && theme.hex) || "a colour you can't quite name";
  // Where the colour came from: "today", "dice", or a day picked in the colour calendar
  const source = () => (!theme || !theme.choice ? "today" : theme.chosenDate ? "day" : "dice");
  const chosenDay = () =>
    theme.chosenDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const posts = readPosts();
  const signpost = findSignpost(location.pathname, posts);

  const state = { haveChip: false, chipOnFloor: true, pushedOnce: false };

  const DOORS = {
    home: { url: "/", label: "HOME" },
    blog: { url: "/blog/", label: "BLOG" },
    made: { url: "/#made", label: "THINGS I'VE MADE" },
    cv: { url: "/cv/", label: "CV" },
    button: { url: "/push-the-button/", label: "BUTTON" },
  };

  const DOOR_WORDS = {
    home: "home",
    house: "home",
    blog: "blog",
    posts: "blog",
    made: "made",
    things: "made",
    projects: "made",
    cv: "cv",
    resume: "cv",
    button: "button",
  };

  const COMPASS = ["n", "s", "e", "w", "north", "south", "east", "west", "up", "down", "ne", "nw", "se", "sw"];

  form.hidden = false;
  if (signpost) say("There's a wooden signpost in the corner. Maybe it knows where you meant to go.");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    input.value = "";
    say("&gt; " + escapeHtml(raw), "adventure__echo");
    respond(raw);
  });

  // ── Commands ────────────────────────────────────────────────────────────

  function respond(raw) {
    const words = raw
      .toLowerCase()
      .replace(/[^a-z0-9?' ]/g, " ")
      .split(/\s+/)
      .filter((w) => w && !["the", "a", "an", "to", "at", "on", "through", "door", "please"].includes(w));
    const [verb, ...rest] = words;
    const noun = rest.join(" ");

    if (!verb) return say("Pardon?");

    if (["look", "l"].includes(verb) && !noun) return look();
    if (["help", "?", "hint", "hints"].includes(verb)) return help();
    if (["inventory", "i", "inv"].includes(verb)) return inventory();

    if (["go", "walk", "enter", "open", "run", "visit"].includes(verb)) return go(noun);
    if (DOOR_WORDS[verb] && !noun) return go(verb);
    if (verb === "back" || (verb === "go" && noun === "back")) return goBack();
    if (COMPASS.includes(verb))
      return say(
        "You walk " +
          compassName(verb) +
          " for a while and end up back where you started. This room doesn't do directions."
      );

    if (["take", "get", "pick", "grab"].includes(verb)) return take(noun.replace(/^up /, ""));
    if (["drop", "leave"].includes(verb)) return drop(noun);
    if (["examine", "x", "look", "inspect", "read"].includes(verb)) return examine(noun.replace(/^at /, ""));
    if (verb === "follow") return followSign(noun);

    if (["push", "press"].includes(verb)) return push();
    if (["xyzzy", "plugh"].includes(verb)) return say("A hollow voice says: “Wrong adventure.”");
    if (verb === "dance") return say("You do a little dance. Nobody is watching. It's wonderful.");
    if (verb === "sing")
      return say("You hum a few bars. The room has excellent acoustics, for a page that doesn't exist.");
    if (["wait", "z"].includes(verb)) return say("Time passes. The page still isn't here.");
    if (["hello", "hi", "hej", "hey"].includes(verb)) return say("Hello! It's nice to have company down here.");
    if (["colour", "color"].includes(verb)) return colour();
    if (["quit", "exit", "q"].includes(verb)) return say("There's no quitting here, only going <kbd>home</kbd>.");
    if (["search", "find"].includes(verb)) return search(noun);

    return say("I don't know how to “" + escapeHtml(raw) + "”. Type <kbd>help</kbd> for ideas.");
  }

  function colour() {
    if (source() === "today")
      return say("Today the whole site is " + hex() + ". Come back tomorrow and it'll be different.");
    const why = source() === "dice" ? "thanks to the dice" : "borrowed from " + chosenDay();
    say("Right now the whole site is " + hex() + ", " + why + ". Today's real colour is " + theme.today + ".");
  }

  function look() {
    const lines = ["You're in a small, quiet room. The walls are painted " + hex() + "."];
    if (state.chipOnFloor) lines.push("A paint chip lies on the floor.");
    if (signpost) lines.push("A wooden signpost in the corner points somewhere.");
    lines.push(
      "Doors lead <kbd>home</kbd>, to the <kbd>blog</kbd>, to the things i've <kbd>made</kbd>, and to my <kbd>cv</kbd>."
    );
    say(lines.join(" "));
  }

  function help() {
    say(
      "Try <kbd>look</kbd>, <kbd>take chip</kbd>, <kbd>inventory</kbd>, <kbd>read sign</kbd>, " +
        "<kbd>search cucumber</kbd>, or <kbd>go blog</kbd>. Some other things might work too."
    );
  }

  function inventory() {
    say(state.haveChip ? "You are carrying a paint chip (" + hex() + ")." : "You are carrying nothing but curiosity.");
  }

  function take(noun) {
    if (isChip(noun)) {
      if (state.haveChip) return say("You already have it.");
      if (!state.chipOnFloor) return say("There's no paint chip here.");
      state.haveChip = true;
      state.chipOnFloor = false;
      return say("You pick up the paint chip. It smells faintly of today.");
    }
    if (isSign(noun) && signpost) return say("The signpost is firmly stuck in the floor. Signposts usually are.");
    if (!noun) return say("Take what?");
    return say("There's no " + escapeHtml(noun) + " here. There isn't much of anything here, really.");
  }

  function drop(noun) {
    if (isChip(noun) && state.haveChip) {
      state.haveChip = false;
      state.chipOnFloor = true;
      return say("You put the paint chip back on the floor, exactly where it was.");
    }
    return say("You aren't carrying that.");
  }

  function examine(noun) {
    if (!noun) return look();
    if (isChip(noun) && (state.haveChip || state.chipOnFloor)) {
      if (source() === "dice")
        return say("It's a paint chip, " + hex() + ". It changed colour when you rolled the dice. Spooky.");
      if (source() === "day") return say("It's a paint chip, " + hex() + ", the colour of " + chosenDay() + ".");
      return say("It's a paint chip in today's colour, " + hex() + ". Tomorrow it will be a different colour.");
    }
    if (isSign(noun) && signpost) {
      return say(
        `The signpost says: <a href="${signpost.url}">${escapeHtml(signpost.title)}</a>. ` +
          "Type <kbd>follow sign</kbd> to go there."
      );
    }
    if (["wall", "walls", "room"].includes(noun))
      return say(
        "The walls are painted " +
          hex() +
          ". Freshly, by the look of it. They change every day, or whenever someone rolls the dice."
      );
    if (["floor", "ground"].includes(noun))
      return say("A very ordinary floor." + (state.chipOnFloor ? " A paint chip lies on it." : ""));
    if (["door", "doors"].includes(noun)) return say("There are doors marked HOME, BLOG, THINGS I'VE MADE and CV.");
    if (["me", "self", "myself"].includes(noun)) return say("You look as lovely as ever.");
    return say("You don't see any " + escapeHtml(noun) + " here.");
  }

  function followSign(noun) {
    if (signpost && (!noun || isSign(noun))) {
      say("You follow the signpost…");
      return travel(signpost.url);
    }
    return say("There's nothing here to follow.");
  }

  function go(noun) {
    if (!noun)
      return say("Go where? The doors lead <kbd>home</kbd>, <kbd>blog</kbd>, <kbd>made</kbd> and <kbd>cv</kbd>.");
    if (noun === "back") return goBack();
    if (isSign(noun)) return followSign("");
    const key = DOOR_WORDS[noun.split(" ")[0]];
    if (key === "button" && !state.pushedOnce) return say("You don't know where that is. Yet.");
    if (key) {
      say("You open the door marked " + DOORS[key].label + " and step through…");
      return travel(DOORS[key].url);
    }
    return say("There's no door to " + escapeHtml(noun) + " here.");
  }

  function goBack() {
    if (history.length > 1) {
      say("You retrace your steps…");
      setTimeout(() => history.back(), 700);
    } else {
      say("You came here directly. There's no back, only <kbd>home</kbd>.");
    }
  }

  function push() {
    state.pushedOnce = true;
    say("There's no button here. But i know where there is one. Type <kbd>go button</kbd>.");
  }

  function search(noun) {
    if (!noun) return say("Search for what? Try <kbd>search cucumber</kbd>.");
    const terms = noun.split(" ").filter((w) => w.length > 1);
    const hits = posts.filter((p) => terms.every((t) => p.title.toLowerCase().includes(t))).slice(0, 5);
    if (!hits.length) return say("You search everywhere, but find nothing about “" + escapeHtml(noun) + "”.");
    say(
      "You find some scraps of paper:" +
        "<ul>" +
        hits.map((p) => `<li><a href="${p.url}">${escapeHtml(p.title)}</a></li>`).join("") +
        "</ul>"
    );
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  function say(html, className) {
    const p = document.createElement(html.includes("<ul>") ? "div" : "p");
    p.innerHTML = html;
    if (className) p.className = className;
    log.appendChild(p);
    while (log.children.length > 80) log.removeChild(log.firstChild);
    log.scrollTop = log.scrollHeight;
  }

  function travel(url) {
    input.disabled = true;
    setTimeout(() => {
      location.href = url;
    }, 700);
  }

  function isChip(noun) {
    return ["chip", "paint chip", "paint", "paintchip"].includes(noun);
  }

  function isSign(noun) {
    return ["sign", "signpost", "post"].includes(noun);
  }

  function compassName(dir) {
    const names = {
      n: "north",
      s: "south",
      e: "east",
      w: "west",
      ne: "north-east",
      nw: "north-west",
      se: "south-east",
      sw: "south-west",
    };
    return names[dir] || dir;
  }

  // Only used for text inside elements (never attributes), so quotes are safe
  function escapeHtml(text) {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
    return text.replace(/[&<>]/g, (c) => entities[c]);
  }

  function readPosts() {
    try {
      return JSON.parse(document.getElementById("adventure-posts").textContent);
    } catch {
      return [];
    }
  }

  // If the missing address shares words with a post title, point to that post.
  function findSignpost(path, list) {
    const words = path
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length > 3 && !["html", "blog", "page"].includes(w));
    if (!words.length) return null;
    let best = null;
    let bestScore = 0;
    for (const post of list) {
      const title = post.title.toLowerCase();
      const score = words.filter((w) => title.includes(w)).length;
      if (score > bestScore) {
        best = post;
        bestScore = score;
      }
    }
    return best;
  }
})();
