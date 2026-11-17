// A year in colour: every day as a square in its own Daily Color.
// Each square links to the homepage previewing that day (?date=YYYY-MM-DD).

(function () {
  const theme = window.dailyTheme;
  const calendar = document.querySelector("[data-calendar]");
  if (!theme || !calendar) return;

  const yearHeading = calendar.querySelector("[data-year]");
  const months = calendar.querySelector("[data-months]");
  const today = theme.date;
  const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

  // The year to show can be in the address, like /colours/#2027
  let year = Number(location.hash.slice(1)) || today.getFullYear();

  calendar.hidden = false;
  render();

  calendar.querySelectorAll("[data-step]").forEach((button) => {
    button.addEventListener("click", () => {
      year += Number(button.dataset.step);
      history.replaceState(null, "", "#" + year);
      render();
    });
  });

  function render() {
    yearHeading.textContent = year;
    months.replaceChildren(...Array.from({ length: 12 }, (_, month) => monthBlock(month)));
  }

  function monthBlock(month) {
    const section = document.createElement("section");
    section.className = "month";

    const title = document.createElement("h3");
    title.className = "month__name";
    title.textContent = new Date(year, month, 1).toLocaleDateString("en-GB", { month: "long" });
    section.append(title);

    const grid = document.createElement("ol");
    grid.className = "month__days";
    grid.setAttribute("aria-label", title.textContent + " " + year);

    WEEKDAYS.forEach((letter) => {
      const li = document.createElement("li");
      li.className = "month__weekday";
      li.setAttribute("aria-hidden", "true");
      li.textContent = letter;
      grid.append(li);
    });

    const days = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const date = new Date(year, month, d);
      const hex = theme.colourFor(date);
      const li = document.createElement("li");
      // Weeks start on Monday
      if (d === 1) li.style.gridColumnStart = ((date.getDay() + 6) % 7) + 1;

      const link = document.createElement("a");
      link.className = "day";
      link.href = "/?date=" + isoDate(date);
      link.textContent = d;
      link.title = hex;
      link.style.setProperty("--day", hex);
      link.style.setProperty("--day-ink", theme.inkFor(hex));
      link.setAttribute("aria-label", longDate(date) + ", " + hex);
      if (sameDay(date, today)) {
        link.setAttribute("aria-current", "date");
        link.classList.add("day--today");
      }
      li.append(link);
      grid.append(li);
    }

    section.append(grid);
    return section;
  }

  // ── Dates ───────────────────────────────────────────────────────────────
  function isoDate(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function longDate(date) {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
})();
