// "In this post": open the list when there's room for it in the margin, and
// highlight the section you're reading.

(function () {
  const box = document.querySelector("[data-post-toc]");
  if (!box) return;

  // Wide screens show the list beside the post, always open
  const wide = window.matchMedia("(min-width: 84rem)");
  const fit = () => {
    if (wide.matches) box.open = true;
  };
  fit();
  wide.addEventListener("change", fit);

  const links = new Map();
  box.querySelectorAll("a[href^='#']").forEach((link) => {
    const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (heading) links.set(heading, link);
  });
  if (!links.size) return;

  // The current section is the last heading that has scrolled past the top third
  const headings = [...links.keys()];
  function update() {
    const line = window.innerHeight / 3;
    let current = null;
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= line) current = heading;
    }
    links.forEach((link, heading) => {
      if (heading === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  let queued = false;
  window.addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    },
    { passive: true }
  );
  update();
})();
