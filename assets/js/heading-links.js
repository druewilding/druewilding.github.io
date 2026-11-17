// A "#" link on each section heading in a post. Clicking it puts the
// section's address in the URL bar and copies it, ready to share.

(function () {
  document.querySelectorAll(".prose h2[id], .prose h3[id]").forEach((heading) => {
    const link = document.createElement("a");
    link.className = "heading-link";
    link.href = "#" + heading.id;
    link.textContent = "#";
    link.setAttribute("aria-label", "Link to “" + heading.textContent.trim() + "”");
    heading.append(" ", link);

    link.addEventListener("click", () => {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(link.href).then(() => {
        link.dataset.copied = "";
        setTimeout(() => delete link.dataset.copied, 1500);
      });
    });
  });
})();
