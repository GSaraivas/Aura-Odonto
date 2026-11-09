"use strict";

(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const source = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/";
  const loadScript = file => new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = source + file;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });

  window.AuraMotion = {
    menu(panel) {
      if (!window.gsap || reduced.matches) return;
      gsap.fromTo(panel, { opacity: 0, y: -12 }, {
        opacity: 1, y: 0, duration: .36, ease: "power3.out", overwrite: true, clearProps: "opacity,transform"
      });
    }
  };

  async function init() {
    try {
      await loadScript("gsap.min.js");
      await loadScript("ScrollTrigger.min.js");
    } catch {
      return; // The base layout and all controls work without the CDN.
    }
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const reveals = new WeakMap();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const view = document.querySelector(".hero").getBoundingClientRect();
      // Avoid hiding content after a delayed network response or restored scroll position.
      if (view.top > -40 && performance.now() < 1400 && document.activeElement === document.body) {
        gsap.timeline({ defaults: { ease: "power3.out", duration: .7 } })
          .from(".header", { opacity: 0, y: -7, duration: .4, clearProps: "opacity,transform" }, 0)
          .from(".hero .eyebrow", { opacity: 0, y: 8 }, .06)
          .from(".hero h1>span>span", { yPercent: 103, stagger: .09, duration: .83 }, .13)
          .from(".hero .lead", { opacity: 0, y: 10 }, .35)
          .from(".hero-actions a", { opacity: 0, y: 9, stagger: .08 }, .42)
          .from(".hero-image", { clipPath: "inset(0 0 9% 0)", duration: 1.05, clearProps: "clipPath" }, .03)
          .from(".hero-figure figcaption, .hero-index", { opacity: 0, stagger: .07 }, .51);
      }

      const belowFold = element => element.getBoundingClientRect().top > innerHeight;
      gsap.utils.toArray("[data-reveal]").filter(belowFold).forEach(group => {
        const elements = [...group.children];
        const reveal = gsap.from(elements, {
          opacity: 0, y: 14, duration: .66, stagger: .075, ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 91%", once: true }
        });
        for (const element of elements) reveals.set(element, reveal);
        const rule = group.querySelector(".eyebrow span");
        if (rule) gsap.from(rule, {
          scaleX: 0, duration: .8, ease: "power3.out",
          scrollTrigger: { trigger: group, start: "top 91%", once: true }
        });
      });

      gsap.utils.toArray("[data-stagger] > *").filter(belowFold).forEach(card => {
        const offset = Array.from(card.parentNode.children).indexOf(card) % 3;
        const reveal = gsap.from(card, {
          opacity: 0, y: 16, duration: .56, delay: offset * .07, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 94%", once: true }
        });
        reveals.set(card, reveal);
      });
    });

    media.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray("[data-image]").forEach(frame => {
        if (frame.getBoundingClientRect().top < innerHeight) return;
        gsap.from(frame, {
          clipPath: "inset(0 0 13% 0)", duration: .92, ease: "power3.out", clearProps: "clipPath",
          scrollTrigger: { trigger: frame.parentElement, start: "top 92%", once: true }
        });
      });

      for (const selector of [".hero-image img", ".experience-image img", ".clinic-figure img"]) {
        const image = document.querySelector(selector);
        if (!image) continue;
        gsap.fromTo(image, { yPercent: -2, scale: 1.07 }, {
          yPercent: 2, scale: 1.07, ease: "none",
          scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: .6 }
        });
      }
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    document.addEventListener("focusin", event => {
      for (let node = event.target; node && node !== document.body; node = node.parentElement) {
        const reveal = reveals.get(node);
        if (reveal?.scrollTrigger) reveal.progress(1);
      }
    });
  }

  if (!reduced.matches) init();
  else reduced.addEventListener("change", init, { once: true });
})();
