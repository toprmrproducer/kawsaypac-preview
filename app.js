/* ═══════════════════════════════════════════════════════════
   KAWSAYPAC · interactions (progressive enhancement only)
   Content is fully visible without JS. Everything here adds motion.
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── broken-image guard: branded gradient placeholder ── */
  var PLACEHOLDER =
    "data:image/svg+xml," +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>" +
        "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
        "<stop offset='0' stop-color='#F3F0E9'/><stop offset='1' stop-color='#E5D9A8'/>" +
        "</linearGradient></defs>" +
        "<rect width='800' height='600' fill='url(#g)'/>" +
        "<g fill='none' stroke='#C9A942' stroke-width='6' opacity='0.55' transform='translate(340,240)'>" +
        "<circle cx='60' cy='60' r='54'/><circle cx='60' cy='60' r='17'/><circle cx='60' cy='43' r='17'/>" +
        "<circle cx='60' cy='77' r='17'/><circle cx='75' cy='51' r='17'/><circle cx='75' cy='69' r='17'/>" +
        "<circle cx='45' cy='51' r='17'/><circle cx='45' cy='69' r='17'/></g></svg>"
    );
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      if (img.src !== PLACEHOLDER) { img.src = PLACEHOLDER; img.style.objectFit = "cover"; }
    });
  });

  /* ── nav: compact on scroll ── */
  var header = document.getElementById("siteHeader");
  var onScrollHeader = function () {
    if (window.scrollY > 80) header.classList.add("compact");
    else header.classList.remove("compact");
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ── nav: click-toggle dropdowns (senior rule: hover AND click) ── */
  document.querySelectorAll(".has-drop").forEach(function (li) {
    var btn = li.querySelector(".drop-trigger");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.querySelectorAll(".has-drop.open").forEach(function (other) {
        if (other !== li) {
          other.classList.remove("open");
          var otherBtn = other.querySelector(".drop-trigger");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".has-drop.open").forEach(function (li) {
      li.classList.remove("open");
      var b = li.querySelector(".drop-trigger");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  });

  /* ── mobile menu ── */
  var toggle = document.querySelector(".nav-toggle");
  var sheet = document.getElementById("mobileSheet");
  if (toggle && sheet) {
    toggle.addEventListener("click", function () {
      var open = sheet.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      sheet.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.style.overflow = open ? "hidden" : "";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sheet.classList.contains("open")) {
        sheet.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        sheet.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
    sheet.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        sheet.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        sheet.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      });
    });
  }


  /* ── hero mini carousel ── */
  (function () {
    var imgs = document.querySelectorAll(".hero-card-imgs img");
    var dots = document.querySelectorAll(".hero-card-txt .dots i");
    if (!imgs.length) return;
    if (prefersReduced) return;
    var i = 0;
    setInterval(function () {
      imgs[i].classList.remove("on");
      if (dots[i]) dots[i].classList.remove("on");
      i = (i + 1) % imgs.length;
      imgs[i].classList.add("on");
      if (dots[i]) dots[i].classList.add("on");
    }, 4000);
  })();

  /* ── altitude ledger ── */
  var altLabel = document.getElementById("altLabel");
  if (altLabel && "IntersectionObserver" in window) {
    var sections = document.querySelectorAll("[data-alt]");
    var altIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            var next = en.target.getAttribute("data-alt");
            if (altLabel.textContent !== next) {
              altLabel.classList.add("swap");
              setTimeout(function () {
                altLabel.textContent = next;
                altLabel.classList.remove("swap");
              }, 240);
            }
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(function (s) { altIO.observe(s); });
  }

  /* ── trust bar count-up ── */
  (function () {
    var stats = document.querySelectorAll("[data-count]");
    if (!stats.length || !("IntersectionObserver" in window)) return;
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || done) return;
        done = true;
        stats.forEach(function (el) {
          var target = parseFloat(el.getAttribute("data-count"));
          var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
          var suffix = el.getAttribute("data-suffix") || "";
          var t0 = null;
          el.textContent = "0" + suffix;
          var step = function (ts) {
            if (!t0) t0 = ts;
            var p = Math.min((ts - t0) / 1400, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = target * eased;
            el.textContent =
              (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US")) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      });
    }, { threshold: 0.4 });
    io.observe(stats[0]);
  })();

  /* ── blends carousel arrows + keyboard ── */
  (function () {
    var car = document.getElementById("blendCar");
    if (!car) return;
    var step = 316;
    var prev = document.getElementById("carPrev");
    var next = document.getElementById("carNext");
    if (prev) prev.addEventListener("click", function () { car.scrollBy({ left: -step * 2, behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { car.scrollBy({ left: step * 2, behavior: "smooth" }); });
    car.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); car.scrollBy({ left: -step, behavior: "smooth" }); }
      if (e.key === "ArrowRight") { e.preventDefault(); car.scrollBy({ left: step, behavior: "smooth" }); }
    });
  })();

  /* ── testimonial rotator ── */
  (function () {
    var wrap = document.getElementById("quoteRotator");
    if (!wrap) return;
    var qs = wrap.querySelectorAll(".q");
    var i = 0, timer = null, paused = false;
    var show = function (n) {
      qs[i].classList.remove("on");
      i = (n + qs.length) % qs.length;
      qs[i].classList.add("on");
    };
    var start = function () {
      if (prefersReduced) return;
      timer = setInterval(function () { if (!paused) show(i + 1); }, 6000);
    };
    start();
    var prev = document.getElementById("qPrev");
    var next = document.getElementById("qNext");
    if (prev) prev.addEventListener("click", function () { show(i - 1); });
    if (next) next.addEventListener("click", function () { show(i + 1); });
    var panel = wrap.closest(".testi-panel");
    if (panel) {
      panel.addEventListener("mouseenter", function () { paused = true; });
      panel.addEventListener("mouseleave", function () { paused = false; });
      panel.addEventListener("focusin", function () { paused = true; });
      panel.addEventListener("focusout", function () { paused = false; });
    }
  })();

  /* ── retreats video lightbox (facade) ── */
  (function () {
    var btn = document.getElementById("playRetreat");
    var lb = document.getElementById("lightbox");
    var frame = document.getElementById("lbFrame");
    var close = document.getElementById("lbClose");
    if (!btn || !lb) return;
    var lastFocus = null;
    var open = function () {
      lastFocus = document.activeElement;
      frame.innerHTML =
        '<iframe src="https://player.vimeo.com/video/1210451731?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1&amp;muted=1&amp;loop=1" title="Kawsaypac mountain film" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      close.focus();
    };
    var shut = function () {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      frame.innerHTML = "";
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    btn.addEventListener("click", open);
    var watch = document.getElementById("watchRetreat");
    if (watch) watch.addEventListener("click", open);
    close.addEventListener("click", shut);
    lb.addEventListener("click", function (e) { if (e.target === lb) shut(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("open")) shut();
      if (e.key === "Tab" && lb.classList.contains("open")) {
        var focusable = lb.querySelectorAll('button, iframe, a[href], [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();

  /* ── journal form ── */
  (function () {
    var form = document.getElementById("journalForm");
    var ok = document.getElementById("journalOk");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.querySelector("input");
      if (!email.value || email.value.indexOf("@") < 1) {
        ok.textContent = "Please enter a valid email address.";
        ok.hidden = false;
        email.focus();
        email.style.borderColor = "#B0563C";
        return;
      }
      email.style.borderColor = "";
      ok.textContent = "Opening your email app so you can request an invitation to the Herbal Journal.";
      ok.hidden = false;
      window.location.href = "mailto:hello@theelectriceats.com?subject=Join%20the%20Kawsaypac%20Herbal%20Journal&body=" + encodeURIComponent("Please add " + email.value + " to the Herbal Journal.");
    });
  })();

  /* ── scroll progress bar (shared: any page including app.js gets it) ── */
  var initProgress = function () {
    if (prefersReduced || document.querySelector(".scroll-progress")) return;
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var ticking = false;
    var update = function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      bar.style.transform = "scaleX(" + p + ")";
    };
    var request = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });
    update();
  };

  /* ═══════════ GSAP motion layer ═══════════ */
  var motionReady = false;
  var initMotion = function () {
    if (motionReady || prefersReduced || typeof gsap === "undefined") return;
    motionReady = true;
    if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
    /* native scroll + anchor focus management (no scroll-hijack: must feel light) */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      if (a.classList.contains("skip-link")) return;
      a.addEventListener("click", function () {
        var id = a.getAttribute("href");
        if (id.length > 1) {
          var el = document.querySelector(id);
          if (el) {
            el.tabIndex = -1;
            setTimeout(function () { el.focus({ preventScroll: true }); }, 350);
          }
        }
      });
    });

    /* hero entrance: H1 lines stagger in from the left, 0.2s after DOM ready */
    var heroTl = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
    heroTl
      .from(".hero-stars", { x: -24, autoAlpha: 0, duration: 0.7, immediateRender: false }, 0)
      .from(".hero-h1 .h1-line", { x: -56, autoAlpha: 0, duration: 0.9, stagger: 0.08, immediateRender: false }, 0.08)
      .from(".hero-lede", { x: -36, autoAlpha: 0, duration: 0.8, immediateRender: false }, 0.34)
      .from(".hero-cta .btn", { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.08, immediateRender: false }, 0.5)
      .from(".hero-card", { x: 46, autoAlpha: 0, duration: 0.9, immediateRender: false }, 0.65)
      .from(".hero-badge", { y: -18, autoAlpha: 0, duration: 0.7, immediateRender: false }, 0.55);

    /* a quiet living object at the top, after the entrance has settled */
    heroTl.call(function () {
      gsap.to(".hero-card", {
        y: -6,
        rotation: 0.25,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    var groupedRevealSelector = ".pathway-card, .p-card, .bowl, .specimen";

    /* generic reveals: text enters from the left, cards fade up */
    gsap.utils.toArray(".reveal").forEach(function (el) {
      if (el.classList.contains("story-imgs")) return; /* gets the clip-path unmask instead */
      if (el.matches(groupedRevealSelector)) return; /* grouped below for a deliberate stagger */
      var vars = {
        autoAlpha: 0, duration: 0.9, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 82%", once: true }
      };
      if (el.classList.contains("kicker")) { vars.x = -24; vars.duration = 0.7; }
      else if (el.classList.contains("section-lede")) { vars.x = -36; vars.duration = 0.8; vars.delay = 0.08; }
      else if (el.tagName === "P") { vars.y = 18; vars.duration = 0.7; }
      else { vars.y = 30; }
      gsap.from(el, vars);
    });

    /* headings slide from the left (robust: no DOM splitting, mixed children stay intact) */
    gsap.utils.toArray(".reveal-words").forEach(function (el) {
      gsap.from(el, {
        x: -56, autoAlpha: 0, duration: 0.9, ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 82%", once: true }
      });
    });

    /* coherent card families enter as one composition instead of firing randomly */
    [
      { targets: ".pathway-grid .pathway-card", trigger: ".pathway-grid", distance: 38, each: 0.11 },
      { targets: "#blendCar .p-card", trigger: "#blendCar", distance: 32, each: 0.08 },
      { targets: ".bowls .bowl", trigger: ".bowls", distance: 30, each: 0.07 },
      { targets: ".specimens .specimen", trigger: ".specimens", distance: 34, each: 0.09 }
    ].forEach(function (group) {
      var items = gsap.utils.toArray(group.targets);
      if (!items.length || !document.querySelector(group.trigger)) return;
      gsap.from(items, {
        y: group.distance,
        autoAlpha: 0,
        duration: 0.85,
        stagger: group.each,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: group.trigger,
          start: "top 84%",
          once: true
        }
      });
    });

    /* image unmasks: clip-path sweeps open from the left */
    var unmask = function (targets, triggerEl, stagger, delay) {
      var els = gsap.utils.toArray(targets);
      if (!els.length) return;
      gsap.fromTo(els,
        { clipPath: "inset(0% 100% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.out",
          stagger: stagger || 0, delay: delay || 0, immediateRender: false,
          scrollTrigger: { trigger: triggerEl, start: "top 82%", once: true }
        });
    };
    unmask(".story-imgs .story-main img", ".story-imgs");
    unmask(".story-polaroid", ".story-imgs", 0, 0.15);
    unmask(".pathway-card .pathway-image", ".pathway-grid", 0.08);

    if (typeof ScrollTrigger !== "undefined") {
      /* top-of-page depth only: no pinned sections or scroll hijacking */
      gsap.to(".hero-base", {
        scale: 1.045,
        yPercent: 1.25,
        ease: "none",
        scrollTrigger: {
          trigger: ".j-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.1
        }
      });

      /* the journey becomes living again at the Amazon floor */
      gsap.from(".footer-card", {
        y: 38,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".j-footer", start: "top 78%", once: true }
      });
      gsap.from(".f-leaf", {
        autoAlpha: 0,
        duration: 1.25,
        stagger: 0.14,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: { trigger: ".j-footer", start: "top 82%", once: true }
      });
    }

  };

  /* safety net: never leave anything invisible */
  var safetyNet = function () {
    setTimeout(function () {
      document.querySelectorAll('[style*="visibility: hidden"], [style*="opacity: 0"]').forEach(function (el) {
        if (el.closest(".quote-rotator")) return;
        el.style.opacity = "";
        el.style.visibility = "";
      });
    }, 4000);
  };

  /* ── micro-interactions: magnetic buttons + responsive card imagery ── */
  var initMicro = function () {
    if (prefersReduced || window.innerWidth < 900 || typeof gsap === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) / r.width;
        var dy = (e.clientY - r.top - r.height / 2) / r.height;
        gsap.to(b, { x: dx * 6, y: dy * 5, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      });
      b.addEventListener("mouseleave", function () {
        gsap.to(b, { x: 0, y: 0, duration: 0.5, ease: "power3.out", clearProps: "transform", overwrite: "auto" });
      });
    });

    document.querySelectorAll(".p-card, .pathway-card, .specimen").forEach(function (c) {
      var visual = c.querySelector(".p-img img, .pathway-image img") || c.querySelector("img");
      if (!visual) return;
      c.addEventListener("mousemove", function (e) {
        var r = c.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(visual, {
          x: dx * 9,
          y: dy * 7,
          scale: 1.05,
          duration: 0.42,
          ease: "power2.out",
          overwrite: "auto"
        });
      });
      c.addEventListener("mouseleave", function () {
        gsap.to(visual, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
          clearProps: "transform",
          overwrite: "auto"
        });
      });
    });
  };

  /* motion + progress start at DOM ready (gsap is deferred, so it's parsed by now);
     load stays as a fallback for any readyState edge */
  var boot = function () { initProgress(); initMotion(); };
  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
  if (document.readyState === "complete") { boot(); initMicro(); safetyNet(); }
  else window.addEventListener("load", function () { boot(); initMicro(); safetyNet(); });
})();
