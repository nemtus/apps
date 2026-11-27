// main.js — the only script on the site. Everything here is progressive enhancement:
// without it every page is still fully readable (see the `.js` guards in common.css).
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Entrance animations: reveal [data-anim] elements once they enter the viewport.
  const animated = document.querySelectorAll("[data-anim]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          el.style.animationDelay = `${Number(el.dataset.delay || 0)}ms`;
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    animated.forEach((el) => io.observe(el));
  } else {
    animated.forEach((el) => el.classList.add("is-in"));
  }

  // 2. Scroll-to-top button: visible after 100px of scrolling, scrolls smoothly to the top.
  const toTop = document.querySelector(".to-top");
  if (toTop) {
    const update = () => toTop.classList.toggle("is-shown", window.scrollY > 100);
    window.addEventListener("scroll", update, { passive: true });
    update();
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }),
    );
  }

  // 3. Carousels: auto-advance a scroll-snap track one slide at a time, looping back to
  //    the start. Pauses while hovered/focused; arrow/dot controls are plain buttons.
  document.querySelectorAll("[data-carousel]").forEach((root) => {
    const track = root.querySelector(".carousel__track");
    if (!track) return;
    const slides = Array.from(track.children);
    const interval = Number(root.dataset.interval || 5000);
    const step = () => slides[0].getBoundingClientRect().width;
    const perView = () => Math.max(1, Math.round(track.clientWidth / step()));
    const maxIndex = () => Math.max(0, slides.length - perView());
    const current = () => Math.round(track.scrollLeft / step());
    const go = (i) => {
      const n = maxIndex();
      const idx = i > n ? 0 : i < 0 ? n : i;
      track.scrollTo({ left: idx * step(), behavior: reduceMotion ? "auto" : "smooth" });
    };
    root.querySelector(".carousel__prev")?.addEventListener("click", () => go(current() - 1));
    root.querySelector(".carousel__next")?.addEventListener("click", () => go(current() + 1));
    let paused = false;
    root.addEventListener("mouseenter", () => (paused = true));
    root.addEventListener("mouseleave", () => (paused = false));
    root.addEventListener("focusin", () => (paused = true));
    root.addEventListener("focusout", () => (paused = false));
    if (!reduceMotion) setInterval(() => !paused && !document.hidden && go(current() + 1), interval);
  });
})();
