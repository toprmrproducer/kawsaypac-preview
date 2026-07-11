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

  /* ----- hummingbird companion: follows the visitor like the PeachWeb fish ----- */
  function initCompanion() {
    if (window.matchMedia("(max-width: 960px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.querySelector(".companion")) return;

    var el = document.createElement("div");
    el.className = "companion";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML =
      '<svg viewBox="0 0 74 74" fill="none">' +
      '<g class="bird-body">' +
      '<path class="wing-back" d="M38 34 C30 18, 16 12, 6 16 C16 22, 24 30, 36 35 Z" fill="#958E59"/>' +
      '<path d="M20 44 C10 50, 5 58, 3 66 C12 62, 20 56, 27 48 Z" fill="#1F3A2A"/>' +
      '<path d="M24 40 C30 30, 44 28, 52 34 C58 38, 60 44, 56 48 C50 54, 36 54, 28 48 C24 45, 23 43, 24 40 Z" fill="#1F3A2A"/>' +
      '<path d="M50 34 C56 30, 62 30, 66 33 L72 35 L65 37 C61 40, 55 40, 51 38 Z" fill="#2A2A26"/>' +
      '<circle cx="58" cy="34.5" r="1.6" fill="#FAF9F6"/>' +
      '<path d="M46 46 C44 52, 40 56, 35 58 C39 51, 41 48, 43 45 Z" fill="#C9A942"/>' +
      '<path class="wing-front" d="M38 34 C34 16, 22 6, 10 8 C18 18, 26 28, 36 36 Z" fill="#C9A942"/>' +
      '</g></svg>';
    document.body.appendChild(el);

    var tx = window.innerWidth * 0.72, ty = window.innerHeight * 0.3;
    var x = tx, y = ty, facing = 1, lastX = tx;
    var idleT = 0;

    document.addEventListener("mousemove", function (e) {
      tx = e.clientX + 46;
      ty = e.clientY - 62;
      idleT = 0;
    }, { passive: true });

    window.addEventListener("scroll", function () { idleT = 0; }, { passive: true });

    function tick() {
      idleT += 1;
      // gentle autonomous drift when idle, like a bird losing interest
      if (idleT > 240) {
        tx = window.innerWidth * (0.62 + 0.18 * Math.sin(idleT / 130));
        ty = window.innerHeight * (0.24 + 0.1 * Math.cos(idleT / 170));
      }
      var maxX = window.innerWidth - 84, maxY = window.innerHeight - 84;
      var cx = Math.min(Math.max(tx, 10), maxX);
      var cy = Math.min(Math.max(ty, 74), maxY);
      x += (cx - x) * 0.045;
      y += (cy - y) * 0.045;
      if (x - lastX > 0.35) facing = 1;
      else if (x - lastX < -0.35) facing = -1;
      lastX = x;
      var tilt = Math.max(Math.min((cy - y) * 0.18, 10), -10);
      el.style.transform =
        "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) scaleX(" + facing + ") rotate(" + tilt.toFixed(1) + "deg)";
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCompanion);
  } else {
    initCompanion();
  }
})();
