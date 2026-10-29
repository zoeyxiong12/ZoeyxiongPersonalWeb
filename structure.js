const sections = document.querySelectorAll(".case section");
const links = document.querySelectorAll(".toc a");
if (sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) =>
            link.classList.toggle("active", link.hash === "#" + entry.target.id),
          );
        }
      });
    },
    { rootMargin: "-15% 0px -65% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}
(() => {
  const links = [...document.querySelectorAll(".links a")];
  const setCurrent = (name) =>
    links.forEach((link) => {
      const active = link.textContent.trim() === name;
      link.classList.toggle("is-current", active);
      if (active)
        link.setAttribute(
          "aria-current",
          name === "Work" && document.querySelector("#work") ? "location" : "page",
        );
      else link.removeAttribute("aria-current");
    });
  const page = location.pathname.split("/").pop();
  if (page === "inspiration.html") setCurrent("Inspiration");
  else if (page === "about.html") setCurrent("About");
  else if (page === "personal.html") setCurrent("About");
  else if (["dusk.html", "voice.html", "sketch.html", "tally.html"].includes(page)) setCurrent("Work");
  else {
    const work = document.querySelector("#work");
    if (work) {
      let pending = false;
      const update = () => {
        pending = false;
        const boundary =
          (document.querySelector("header")?.getBoundingClientRect().bottom || 0) +
          innerHeight * 0.22;
        setCurrent(work.getBoundingClientRect().top <= boundary ? "Work" : "");
      };
      addEventListener(
        "scroll",
        () => {
          if (!pending) {
            pending = true;
            requestAnimationFrame(update);
          }
        },
        { passive: true },
      );
      addEventListener("resize", update);
      update();
    }
  }
})();
