/* ============================================================
   KAWSAYPAC — shared behaviour (progressive enhancement only;
   every element remains fully visible if this file never runs)
   ============================================================ */
(function () {
  "use strict";

  /* ----- header scroll state ----- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----- mobile nav ----- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ----- image guard: any broken image gets an on-brand placeholder ----- */
  var PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>" +
        "<rect width='800' height='600' fill='#F1EFE8'/>" +
        "<circle cx='400' cy='270' r='90' fill='none' stroke='#C9A942' stroke-width='2'/>" +
        "<circle cx='400' cy='270' r='30' fill='none' stroke='#C9A942' stroke-width='1.5'/>" +
        "<text x='400' y='420' text-anchor='middle' font-family='Georgia' font-size='30' letter-spacing='10' fill='#1F3A2A'>KAWSAYPAC</text>" +
      "</svg>"
    );
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function handle() {
      img.removeEventListener("error", handle);
      img.src = PLACEHOLDER;
    });
    if (img.complete && img.naturalWidth === 0 && img.src.indexOf("data:") !== 0) {
      img.src = PLACEHOLDER;
    }
  });

  /* ----- YouTube facade ----- */
  var facade = document.getElementById("retreatVideo");
  if (facade) {
    var play = function () {
      var id = facade.getAttribute("data-video-id");
      var iframe = document.createElement("iframe");
      iframe.setAttribute("src", "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0");
      iframe.setAttribute("title", "Kawsaypac retreat film");
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "");
      facade.innerHTML = "";
      facade.appendChild(iframe);
    };
    facade.addEventListener("click", play);
    facade.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });
  }

  /* ----- blends rail arrows ----- */
  var rail = document.getElementById("blendRail");
  if (rail) {
    var step = function () { return Math.min(rail.clientWidth * 0.8, 640); };
    var prev = document.querySelector(".rail-arrow.prev");
    var next = document.querySelector(".rail-arrow.next");
    if (prev) prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: "smooth" }); });
  }

  /* ----- GSAP reveals (safe: from-tweens, once, never leaves content hidden) ----- */
  function initReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var groups = [
      ".hero-copy > *",
      ".hero-visual",
      ".section-head > *",
      ".collection-card",
      ".split-photo",
      ".split-copy > *",
      ".retreats-copy > *",
      ".video-facade",
      ".blend-card",
      ".testi-card",
      ".specimen",
      ".closing-inner > *",
      ".reveal-item"
    ];

    groups.forEach(function (sel) {
      var els = document.querySelectorAll(sel);
      if (!els.length) return;
      els.forEach(function (el, i) {
        gsap.from(el, {
          y: 34,
          opacity: 0,
          duration: 1.05,
          ease: "power3.out",
          delay: (i % 6) * 0.08,
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        });
      });
    });

    /* gentle parallax on arch photos */
    document.querySelectorAll(".photo-arch img, .closing-bg").forEach(function (img) {
      gsap.to(img, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: 1.2 }
      });
    });

    /* safety net: nothing may remain hidden */
    setTimeout(function () {
      document.querySelectorAll('[style*="opacity"]').forEach(function (el) {
        var o = parseFloat(getComputedStyle(el).opacity);
        if (o < 0.9) { el.style.opacity = ""; el.style.transform = ""; }
      });
      ScrollTrigger.refresh();
    }, 3000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReveals);
  } else {
    initReveals();
  }
})();
