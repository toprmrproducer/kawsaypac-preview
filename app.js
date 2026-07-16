/*
 * KAWSAYPAC V1 interaction layer
 * Progressive enhancement only: the document is complete and visible without this file.
 */
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  let body = doc.body;
  const reduceMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false, addEventListener: function () {} };
  const desktopQuery = window.matchMedia
    ? window.matchMedia("(min-width: 960px)")
    : { matches: true, addEventListener: function () {} };
  const finePointerQuery = window.matchMedia
    ? window.matchMedia("(hover: hover) and (pointer: fine)")
    : { matches: false };

  const qs = (selector, scope) => (scope || doc).querySelector(selector);
  const qsa = (selector, scope) => Array.from((scope || doc).querySelectorAll(selector));
  const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
  const isReduced = () => Boolean(reduceMotionQuery.matches);
  const isVisible = (element) => {
    if (!element || element.hidden) return false;
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  };
  const on = (element, eventName, handler, options) => {
    if (element && element.addEventListener) {
      element.addEventListener(eventName, handler, options);
    }
  };
  const safe = (callback) => {
    try {
      return callback();
    } catch (_error) {
      return undefined;
    }
  };

  root.classList.add("has-js");

  /* -------------------------------------------------------------------------- */
  /* Scroll locking and focus containment                                       */
  /* -------------------------------------------------------------------------- */

  const scrollLocks = new Set();
  let savedBodyOverflow = "";
  let savedBodyPaddingRight = "";

  function lockScroll(reason) {
    if (scrollLocks.has(reason)) return;
    if (scrollLocks.size === 0) {
      savedBodyOverflow = body.style.overflow;
      savedBodyPaddingRight = body.style.paddingRight;
      const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) body.style.paddingRight = scrollbarWidth + "px";
      body.classList.add("is-scroll-locked");
    }
    scrollLocks.add(reason);
  }

  function unlockScroll(reason) {
    scrollLocks.delete(reason);
    if (scrollLocks.size === 0) {
      body.style.overflow = savedBodyOverflow;
      body.style.paddingRight = savedBodyPaddingRight;
      body.classList.remove("is-scroll-locked");
    }
  }

  function focusableElements(container) {
    if (!container) return [];
    return qsa(
      'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), details > summary:first-of-type, [tabindex]:not([tabindex="-1"])',
      container
    ).filter((element) => isVisible(element) && element.getClientRects().length > 0);
  }

  function createFocusTrap(container, onEscape) {
    let active = false;
    let returnFocus = null;

    function handleKeydown(event) {
      if (!active) return;
      if (event.key === "Escape") {
        event.preventDefault();
        if (typeof onEscape === "function") onEscape();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = focusableElements(container);
      if (!focusables.length) {
        event.preventDefault();
        if (!container.hasAttribute("tabindex")) container.setAttribute("tabindex", "-1");
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && doc.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && doc.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    return {
      activate(initialFocus) {
        if (active) return;
        active = true;
        returnFocus = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
        on(doc, "keydown", handleKeydown);
        window.requestAnimationFrame(() => {
          const target = initialFocus || focusableElements(container)[0] || container;
          if (target === container && !container.hasAttribute("tabindex")) {
            container.setAttribute("tabindex", "-1");
          }
          safe(() => target.focus({ preventScroll: true }));
        });
      },
      deactivate(restoreFocus) {
        if (!active) return;
        active = false;
        doc.removeEventListener("keydown", handleKeydown);
        if (restoreFocus !== false && returnFocus && doc.contains(returnFocus)) {
          safe(() => returnFocus.focus({ preventScroll: true }));
        }
        returnFocus = null;
      },
      get active() {
        return active;
      }
    };
  }

  /* -------------------------------------------------------------------------- */
  /* Branded image fallback                                                     */
  /* -------------------------------------------------------------------------- */

  const fallbackSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FAF9F6"/><stop offset=".52" stop-color="#E5D9A8"/><stop offset="1" stop-color="#C9A942"/></linearGradient></defs>' +
    '<rect width="1200" height="800" fill="url(#g)"/>' +
    '<g fill="none" stroke="#1F3A2A" stroke-opacity=".28" stroke-width="5" transform="translate(600 400)">' +
    '<circle r="92"/><circle cy="-92" r="92"/><circle cx="79.7" cy="-46" r="92"/><circle cx="79.7" cy="46" r="92"/><circle cy="92" r="92"/><circle cx="-79.7" cy="46" r="92"/><circle cx="-79.7" cy="-46" r="92"/>' +
    '</g><text x="600" y="620" text-anchor="middle" fill="#1F3A2A" fill-opacity=".62" font-family="Georgia,serif" font-size="38" letter-spacing="9">KAWSAYPAC</text></svg>';
  const fallbackImage = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(fallbackSvg);

  function applyImageFallback(image) {
    if (!image || image.dataset.fallbackApplied === "true") return;
    image.dataset.fallbackApplied = "true";
    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    image.removeAttribute("onerror");
    const picture = image.closest("picture");
    if (picture) {
      qsa("source", picture).forEach((source) => source.removeAttribute("srcset"));
    }
    image.src = fallbackImage;
    image.classList.add("has-image-fallback");
  }

  function disableFailedVideo(target) {
    const video = target && target.tagName === "VIDEO" ? target : target && target.closest ? target.closest("video") : null;
    if (!video || video.dataset.videoUnavailable === "true") return;
    video.dataset.videoUnavailable = "true";
    safe(() => video.pause());
    video.classList.add("is-unavailable");
    video.hidden = true;
    video.setAttribute("aria-hidden", "true");
  }

  function initMediaSafety() {
    on(
      doc,
      "error",
      (event) => {
        const target = event.target;
        if (!target || !target.tagName) return;
        if (target.tagName === "IMG") applyImageFallback(target);
        if (target.tagName === "VIDEO" || target.tagName === "SOURCE") disableFailedVideo(target);
      },
      true
    );

    qsa("img").forEach((image) => {
      on(image, "error", () => applyImageFallback(image), { once: true });
      if (image.complete && image.naturalWidth === 0) applyImageFallback(image);
    });
    qsa("video").forEach((video) => on(video, "error", () => disableFailedVideo(video), true));
  }

  /* -------------------------------------------------------------------------- */
  /* Desktop dropdowns and mobile navigation                                    */
  /* -------------------------------------------------------------------------- */

  function initDesktopMenus() {
    const triggers = qsa(".mega-trigger[data-menu], [data-menu-trigger]");
    if (!triggers.length) return;
    const closeTimers = new Map();
    let openTrigger = null;
    let pinnedTrigger = null;

    const panelFor = (trigger) => {
      const controlledId = trigger.getAttribute("aria-controls");
      if (controlledId) {
        const controlled = doc.getElementById(controlledId);
        if (controlled) return controlled;
      }
      const key = trigger.dataset.menu || trigger.dataset.menuTrigger;
      const panels = qsa("[data-menu-panel], .mega-menu, .nav-menu");
      return panels.find((panel) => {
        const panelKey = panel.dataset.menuPanel || panel.dataset.menu || panel.dataset.navMenu;
        return key && panelKey === key;
      }) || null;
    };

    function cancelClose(trigger) {
      const timer = closeTimers.get(trigger);
      if (timer) window.clearTimeout(timer);
      closeTimers.delete(trigger);
    }

    function closeMenu(trigger, restoreFocus) {
      if (!trigger) return;
      cancelClose(trigger);
      const panel = panelFor(trigger);
      trigger.setAttribute("aria-expanded", "false");
      trigger.classList.remove("is-open");
      const wrapper = trigger.closest(".nav-menu-wrap, .nav-item");
      if (wrapper) wrapper.classList.remove("is-open");
      if (panel) {
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        panel.hidden = true;
      }
      if (openTrigger === trigger) openTrigger = null;
      if (pinnedTrigger === trigger) pinnedTrigger = null;
      if (restoreFocus) safe(() => trigger.focus({ preventScroll: true }));
    }

    function closeAll(except) {
      triggers.forEach((trigger) => {
        if (trigger !== except) closeMenu(trigger, false);
      });
    }

    function openMenu(trigger, focusFirst) {
      if (!desktopQuery.matches) return;
      cancelClose(trigger);
      closeAll(trigger);
      const panel = panelFor(trigger);
      if (!panel) return;
      trigger.setAttribute("aria-expanded", "true");
      trigger.classList.add("is-open");
      const wrapper = trigger.closest(".nav-menu-wrap, .nav-item");
      if (wrapper) wrapper.classList.add("is-open");
      panel.hidden = false;
      panel.setAttribute("aria-hidden", "false");
      panel.classList.add("is-open");
      openTrigger = trigger;
      if (focusFirst) {
        window.requestAnimationFrame(() => {
          const first = focusableElements(panel)[0];
          if (first) first.focus();
        });
      }
    }

    function delayedClose(trigger) {
      cancelClose(trigger);
      if (pinnedTrigger === trigger) return;
      closeTimers.set(
        trigger,
        window.setTimeout(() => closeMenu(trigger, false), 150)
      );
    }

    triggers.forEach((trigger) => {
      const panel = panelFor(trigger);
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", "false");
      if (panel) {
        panel.hidden = true;
        panel.setAttribute("aria-hidden", "true");
      }

      on(trigger, "click", (event) => {
        if (!desktopQuery.matches) return;
        event.preventDefault();
        /* Pointer hover opens a menu before click fires. Treat that first click
           as an explicit pin instead of immediately closing the panel again. */
        if (pinnedTrigger === trigger) {
          closeMenu(trigger, false);
        } else {
          openMenu(trigger, false);
          pinnedTrigger = trigger;
        }
      });
      on(trigger, "pointerenter", () => openMenu(trigger, false));
      on(trigger, "pointerleave", () => delayedClose(trigger));
      on(trigger, "focus", () => cancelClose(trigger));
      on(trigger, "keydown", (event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          openMenu(trigger, true);
          pinnedTrigger = trigger;
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (pinnedTrigger === trigger) {
            closeMenu(trigger, false);
          } else {
            openMenu(trigger, false);
            pinnedTrigger = trigger;
          }
        } else if (event.key === "Escape") {
          event.preventDefault();
          closeMenu(trigger, true);
        }
      });

      if (panel) {
        on(panel, "pointerenter", () => cancelClose(trigger));
        on(panel, "pointerleave", () => delayedClose(trigger));
        on(panel, "focusin", () => cancelClose(trigger));
        on(panel, "click", (event) => {
          if (event.target.closest && event.target.closest("a[href]")) closeMenu(trigger, false);
        });
        on(panel, "keydown", (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeMenu(trigger, true);
          }
        });
        on(panel, "focusout", (event) => {
          const destination = event.relatedTarget;
          if (!panel.contains(destination) && destination !== trigger) delayedClose(trigger);
        });
      }
    });

    on(doc, "pointerdown", (event) => {
      if (!openTrigger) return;
      const panel = panelFor(openTrigger);
      if (!openTrigger.contains(event.target) && !(panel && panel.contains(event.target))) {
        closeMenu(openTrigger, false);
      }
    });
    on(doc, "keydown", (event) => {
      if (event.key === "Escape" && openTrigger) closeMenu(openTrigger, true);
    });
    on(doc, "focusin", (event) => {
      if (!openTrigger) return;
      const panel = panelFor(openTrigger);
      if (event.target !== openTrigger && !(panel && panel.contains(event.target))) {
        closeMenu(openTrigger, false);
      }
    });
    on(desktopQuery, "change", () => closeAll());
  }

  function initMobileMenu() {
    const menu = qs("#mobileMenu, #mobile-menu");
    const toggle = qs("#menuToggle, .nav-toggle, [data-mobile-menu-toggle]");
    if (!menu || !toggle) return;
    const closeButton = qs("#menuClose, #mobile-menu-close, [data-mobile-menu-close]", menu);
    let accordions = qsa("[data-accordion-trigger]", menu);
    if (!accordions.length) {
      accordions = qsa("[data-mobile-accordion]", menu)
        .map((item) => (item.matches("button") ? item : qs("button", item)))
        .filter(Boolean);
    }
    let opened = false;
    const trap = createFocusTrap(menu, closeMenu);

    function accordionPanel(trigger) {
      const id = trigger.getAttribute("aria-controls");
      return (id && doc.getElementById(id)) || trigger.nextElementSibling;
    }

    function setAccordion(trigger, expand) {
      const panel = accordionPanel(trigger);
      trigger.setAttribute("aria-expanded", String(expand));
      trigger.classList.toggle("is-open", expand);
      if (panel) {
        panel.hidden = !expand;
        panel.classList.toggle("is-open", expand);
        panel.setAttribute("aria-hidden", String(!expand));
      }
    }

    function openMenu() {
      if (opened) return;
      opened = true;
      menu.hidden = false;
      menu.setAttribute("aria-hidden", "false");
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      body.classList.add("mobile-menu-open", "menu-open");
      if (menu.tagName === "DIALOG" && typeof menu.showModal === "function" && !menu.open) {
        safe(() => menu.showModal());
      }
      lockScroll("mobile-menu");
      trap.activate(closeButton || focusableElements(menu)[0]);
    }

    function closeMenu() {
      if (!opened) return;
      opened = false;
      trap.deactivate(true);
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      body.classList.remove("mobile-menu-open", "menu-open");
      if (menu.tagName === "DIALOG" && menu.open && typeof menu.close === "function") {
        safe(() => menu.close());
      }
      menu.hidden = true;
      unlockScroll("mobile-menu");
    }

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", menu.id || "mobile-menu");
    menu.hidden = true;
    menu.setAttribute("aria-hidden", "true");
    on(toggle, "click", () => (opened ? closeMenu() : openMenu()));
    on(closeButton, "click", closeMenu);
    on(menu, "click", (event) => {
      if (event.target === menu) closeMenu();
      const link = event.target.closest && event.target.closest("a[href]");
      if (link) closeMenu();
    });
    on(menu, "cancel", (event) => {
      event.preventDefault();
      closeMenu();
    });

    accordions.forEach((trigger) => {
      const initiallyOpen = trigger.getAttribute("aria-expanded") === "true";
      setAccordion(trigger, initiallyOpen);
      on(trigger, "click", () => {
        const expand = trigger.getAttribute("aria-expanded") !== "true";
        accordions.forEach((other) => {
          if (other !== trigger) setAccordion(other, false);
        });
        setAccordion(trigger, expand);
      });
    });

    on(desktopQuery, "change", (event) => {
      if (event.matches) closeMenu();
    });
  }

  function initNavCompression() {
    const nav = qs(".site-header > .nav-shell, #site-nav, .site-nav");
    if (!nav) return;
    let queued = false;
    function update() {
      queued = false;
      nav.classList.toggle("is-compressed", window.scrollY > 80);
    }
    function requestUpdate() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }
    on(window, "scroll", requestUpdate, { passive: true });
    update();
  }

  /* -------------------------------------------------------------------------- */
  /* Lenis and motion                                                           */
  /* -------------------------------------------------------------------------- */

  let lenis = null;
  let lenisTicker = null;
  let lenisRaf = 0;

  function stopLenis() {
    if (!lenis) return;
    if (lenisTicker && window.gsap && window.gsap.ticker) {
      safe(() => window.gsap.ticker.remove(lenisTicker));
    }
    if (lenisRaf) window.cancelAnimationFrame(lenisRaf);
    safe(() => lenis.destroy());
    lenis = null;
    lenisTicker = null;
    lenisRaf = 0;
  }

  function startLenis() {
    if (isReduced() || lenis || typeof window.Lenis !== "function") return;
    lenis = safe(() =>
      new window.Lenis({
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false
      })
    );
    if (!lenis) return;

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger && typeof ScrollTrigger.update === "function") {
      safe(() => lenis.on("scroll", ScrollTrigger.update));
    }

    if (gsap && gsap.ticker && typeof gsap.ticker.add === "function") {
      lenisTicker = (time) => {
        if (lenis) lenis.raf(time * 1000);
      };
      safe(() => gsap.ticker.add(lenisTicker));
      safe(() => gsap.ticker.lagSmoothing(0));
    } else {
      const frame = (time) => {
        if (!lenis) return;
        lenis.raf(time);
        lenisRaf = window.requestAnimationFrame(frame);
      };
      lenisRaf = window.requestAnimationFrame(frame);
    }
  }

  function initSmoothScroll() {
    startLenis();
    on(reduceMotionQuery, "change", (event) => {
      if (event.matches) stopLenis();
      else startLenis();
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Deep-linked product notes                                                  */
  /* -------------------------------------------------------------------------- */

  function initDetailsHash() {
    function targetFromHash(hash) {
      if (!hash || hash === "#") return null;
      let id = "";
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch (_error) {
        id = hash.slice(1);
      }
      const target = id ? doc.getElementById(id) : null;
      return target && target.tagName === "DETAILS" ? target : null;
    }

    function reveal(hash, scrollToTarget) {
      const details = targetFromHash(hash);
      if (!details) return false;
      details.open = true;
      if (scrollToTarget) {
        window.requestAnimationFrame(() => {
          details.scrollIntoView({
            behavior: isReduced() ? "auto" : "smooth",
            block: "center"
          });
        });
      }
      return true;
    }

    /* Expand before the browser performs its native fragment jump so the
       destination's final height is already known. */
    on(doc, "click", (event) => {
      const link = event.target.closest && event.target.closest('a[href^="#"]');
      if (link) reveal(link.getAttribute("href"), false);
    }, true);
    on(window, "hashchange", () => reveal(window.location.hash, true));

    reveal(window.location.hash, false);
    onWindowLoad(() => reveal(window.location.hash, true));
  }

  function splitHeadingWords(heading) {
    if (!heading || heading.dataset.wordsSplit === "true") return [];
    const originalLabel = heading.textContent.replace(/\s+/g, " ").trim();
    if (!originalLabel) return [];
    heading.dataset.wordsSplit = "true";
    if (!heading.hasAttribute("aria-label")) heading.setAttribute("aria-label", originalLabel);

    const textNodes = [];
    const walker = doc.createTreeWalker(heading, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (parent && parent.closest(".word-clip")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((textNode) => {
      const fragment = doc.createDocumentFragment();
      textNode.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(doc.createTextNode(part));
          return;
        }
        const clip = doc.createElement("span");
        const word = doc.createElement("span");
        clip.className = "word-clip";
        word.className = "word-inner";
        clip.setAttribute("aria-hidden", "true");
        clip.style.display = "inline-block";
        clip.style.overflow = "hidden";
        clip.style.verticalAlign = "bottom";
        word.style.display = "inline-block";
        word.textContent = part;
        clip.appendChild(word);
        fragment.appendChild(clip);
      });
      textNode.parentNode.replaceChild(fragment, textNode);
    });
    return qsa(".word-inner", heading);
  }

  function onWindowLoad(callback) {
    if (doc.readyState === "complete") window.requestAnimationFrame(callback);
    else on(window, "load", callback, { once: true });
  }

  function initHeroMotion(gsap) {
    const hero = qs("#hero, .hero, [data-hero]");
    if (!hero) return;
    const heroTitle = qs("[data-hero-title]", hero) || qs("h1", hero);
    const titleWords = heroTitle ? splitHeadingWords(heroTitle) : [];
    const allSequence = qsa("[data-hero-sequence]", hero);
    const review = qs("[data-hero-review], .hero-review, .hero-proof", hero);
    const lede = qs("[data-hero-lede], .hero-lede", hero);
    const actions = qs("[data-hero-actions], .hero-actions", hero);
    const card = qs("[data-hero-card], .hero-ritual-card", hero);

    onWindowLoad(() => {
      if (isReduced() || !doc.contains(hero)) return;
      safe(() => {
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        if (review) {
          timeline.from(review, {
            y: 22,
            autoAlpha: 0,
            duration: 0.58,
            immediateRender: false,
            clearProps: "opacity,visibility,transform"
          });
        }
        if (titleWords.length) {
          timeline.from(
            titleWords,
            {
              yPercent: 110,
              duration: 0.78,
              stagger: 0.045,
              immediateRender: false,
              clearProps: "transform"
            },
            review ? "-=0.34" : 0
          );
        } else if (heroTitle) {
          timeline.from(
            heroTitle,
            { y: 28, autoAlpha: 0, duration: 0.78, immediateRender: false, clearProps: "opacity,visibility,transform" },
            review ? "-=0.3" : 0
          );
        }
        [lede, actions].filter(Boolean).forEach((element, index) => {
          timeline.from(
            element,
            { y: 24, autoAlpha: 0, duration: 0.62, immediateRender: false, clearProps: "opacity,visibility,transform" },
            index === 0 ? "-=0.38" : "-=0.43"
          );
        });
        if (card) {
          timeline.from(
            card,
            { x: 42, autoAlpha: 0, duration: 0.78, immediateRender: false, clearProps: "opacity,visibility,transform" },
            "-=0.55"
          );
        }
        const handled = new Set([review, heroTitle, lede, actions, card].filter(Boolean));
        const remaining = allSequence.filter((element) => !handled.has(element) && !element.closest("[data-hero-title]"));
        if (remaining.length) {
          timeline.from(remaining, {
            y: 20,
            autoAlpha: 0,
            duration: 0.55,
            stagger: 0.07,
            immediateRender: false,
            clearProps: "opacity,visibility,transform"
          }, "-=0.4");
        }
      });
    });

    /* Keep the full-resolution hero poster at its native crop. Cloud and
       foreground layers provide depth without scaling the photograph. */
  }

  function initScrollMotion(gsap, ScrollTrigger) {
    const headings = qsa("[data-split-heading]");
    headings.forEach((heading) => {
      const words = splitHeadingWords(heading);
      if (!words.length) return;
      safe(() =>
        gsap.from(words, {
          yPercent: 110,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.04,
          immediateRender: false,
          clearProps: "transform",
          scrollTrigger: {
            trigger: heading,
            start: "top 82%",
            once: true
          }
        })
      );
    });

    const revealElements = qsa("[data-reveal]").filter(
      (element) => !element.matches("[data-split-heading]") && !element.closest("[data-hero], #hero, .hero")
    );
    if (revealElements.length) {
      safe(() =>
        ScrollTrigger.batch(revealElements, {
          start: "top 82%",
          once: true,
          interval: 0.08,
          batchMax: () => (window.innerWidth >= 900 ? 6 : 3),
          onEnter(batch) {
            gsap.from(batch, {
              y: 28,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: "auto",
              immediateRender: false,
              clearProps: "opacity,visibility,transform"
            });
          }
        })
      );
    }

    qsa("[data-parallax]").forEach((element) => {
      const requested = Number.parseFloat(element.dataset.parallaxSpeed || element.dataset.parallax || "-4");
      const interpreted = Number.isFinite(requested) && requested >= 0.5 && requested <= 1.2
        ? (requested - 1) * 40
        : requested;
      const drift = clamp(-6, Number.isFinite(interpreted) ? interpreted : -4, 6);
      safe(() =>
        gsap.to(element, {
          yPercent: drift,
          ease: "none",
          scrollTrigger: {
            trigger: element.closest("section, [data-terrain], .hero-frame") || element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        })
      );
    });

    const hero = qs("#hero, [data-hero]");
    const base = hero && qs(".hero-media-base", hero);
    const peak = hero && qs(".hero-peak-cutout", hero);
    if (hero && base && !base.closest("[data-parallax]")) {
      safe(() =>
        gsap.to(base, {
          yPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1 }
        })
      );
    }
    if (hero && peak && !peak.hasAttribute("data-parallax")) {
      safe(() =>
        gsap.to(peak, {
          yPercent: base && base.closest("[data-parallax]") ? -0.8 : -2.5,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1 }
        })
      );
    }

    const refresh = () => safe(() => ScrollTrigger.refresh());
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(refresh).catch(function () {});
    on(window, "load", refresh, { once: true });
    qsa("img").forEach((image) => {
      if (!image.complete) on(image, "load", refresh, { once: true });
    });
  }

  function initGsap() {
    const gsap = window.gsap;
    if (!gsap) return;
    const ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger && typeof gsap.registerPlugin === "function") {
      safe(() => gsap.registerPlugin(ScrollTrigger));
    }
    const media = typeof gsap.matchMedia === "function" ? gsap.matchMedia() : null;
    const setup = () => {
      initHeroMotion(gsap);
      if (ScrollTrigger) initScrollMotion(gsap, ScrollTrigger);
    };
    if (media) media.add("(prefers-reduced-motion: no-preference)", setup);
    else if (!isReduced()) setup();
  }

  /* -------------------------------------------------------------------------- */
  /* Trust-bar counters and altitude ledger                                     */
  /* -------------------------------------------------------------------------- */

  function countDescriptor(element) {
    const visibleText = element.textContent.trim();
    const match = visibleText.match(/[-+]?\d[\d,]*(?:\.\d+)?/);
    const rawTarget = element.dataset.count || (match ? match[0].replace(/,/g, "") : "0");
    const target = Number.parseFloat(String(rawTarget).replace(/,/g, ""));
    const numericText = match ? match[0] : "";
    const matchIndex = match ? match.index : 0;
    const prefix = element.dataset.countPrefix !== undefined
      ? element.dataset.countPrefix
      : visibleText.slice(0, matchIndex);
    const suffix = element.dataset.countSuffix !== undefined
      ? element.dataset.countSuffix
      : visibleText.slice(matchIndex + numericText.length);
    const targetText = String(rawTarget).replace(/,/g, "");
    const decimals = targetText.includes(".") ? targetText.split(".")[1].length : 0;
    return { target, prefix, suffix, decimals };
  }

  function initCounters() {
    const counters = qsa("[data-count]");
    if (!counters.length) return;

    counters.forEach((element) => {
      const descriptor = countDescriptor(element);
      if (!Number.isFinite(descriptor.target)) return;
      const formatter = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: descriptor.decimals,
        maximumFractionDigits: descriptor.decimals
      });
      const render = (value) => {
        element.textContent = descriptor.prefix + formatter.format(value) + descriptor.suffix;
      };
      let played = false;

      function play() {
        if (played) return;
        played = true;
        if (isReduced()) {
          render(descriptor.target);
          return;
        }
        const duration = 1450;
        const startTime = performance.now();
        function frame(now) {
          const progress = clamp(0, (now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = descriptor.decimals
            ? descriptor.target * eased
            : Math.round(descriptor.target * eased);
          render(current);
          if (progress < 1) window.requestAnimationFrame(frame);
          else render(descriptor.target);
        }
        render(0);
        window.requestAnimationFrame(frame);
      }

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              observer.disconnect();
              play();
            }
          },
          { threshold: 0.45 }
        );
        observer.observe(element);
      } else {
        play();
      }
    });
  }

  function initAltitudeLedger() {
    const ledger = qs(".altitude-ledger, #altitude-ledger");
    const label = qs("#altitude-label", ledger || doc) || qs("[data-altitude-label]");
    const sections = qsa("[data-altitude]");
    if (!ledger || !label || !sections.length) return;
    label.setAttribute("aria-live", "polite");
    const ratios = new Map(sections.map((section) => [section, 0]));
    let current = null;

    function setLabel(section) {
      if (!section || current === section) return;
      current = section;
      const nextText = section.dataset.altitude;
      if (!nextText) return;
      const gsap = window.gsap;
      if (gsap && !isReduced()) {
        safe(() => {
          gsap.killTweensOf(label);
          gsap.set(label, { autoAlpha: 1, y: 0 });
          gsap.to(label, {
            autoAlpha: 0,
            y: -5,
            duration: 0.16,
            ease: "power1.out",
            onComplete() {
              label.textContent = nextText;
              gsap.fromTo(
                label,
                { autoAlpha: 0, y: 5 },
                { autoAlpha: 1, y: 0, duration: 0.24, ease: "power2.out", clearProps: "opacity,visibility,transform" }
              );
            }
          });
        });
      } else {
        label.textContent = nextText;
      }
    }

    function closestToReadingLine() {
      const readingLine = window.innerHeight * 0.44;
      return sections.reduce((closest, section) => {
        const rect = section.getBoundingClientRect();
        const center = clamp(rect.top, readingLine, rect.bottom);
        const distance = Math.abs(center - readingLine);
        return !closest || distance < closest.distance ? { section, distance } : closest;
      }, null);
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
          const active = sections
            .map((section) => ({ section, ratio: ratios.get(section) || 0 }))
            .sort((a, b) => b.ratio - a.ratio)[0];
          if (active && active.ratio > 0) setLabel(active.section);
          else {
            const closest = closestToReadingLine();
            if (closest) setLabel(closest.section);
          }
        },
        { rootMargin: "-28% 0px -48% 0px", threshold: [0, 0.05, 0.15, 0.3, 0.6, 1] }
      );
      sections.forEach((section) => observer.observe(section));
    } else {
      let queued = false;
      on(window, "scroll", () => {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(() => {
          queued = false;
          const closest = closestToReadingLine();
          if (closest) setLabel(closest.section);
        });
      }, { passive: true });
    }
    setLabel(sections[0]);
  }

  /* -------------------------------------------------------------------------- */
  /* Conversion ribbons                                                         */
  /* -------------------------------------------------------------------------- */

  function ensureMotionStyles() {
    if (qs('link[href="motion.css"]')) return;
    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = "motion.css";
    doc.head.appendChild(link);
  }

  function ribbonCopy(items, className, hidden) {
    const copy = doc.createElement("div");
    copy.className = className + "__copy";
    if (hidden) copy.setAttribute("aria-hidden", "true");
    items.forEach((item) => {
      const span = doc.createElement("span");
      span.className = className + "__item";
      if (item.emphasis) {
        span.append(doc.createTextNode(item.before || ""));
        const emphasis = doc.createElement("em");
        emphasis.textContent = item.emphasis;
        span.append(emphasis, doc.createTextNode(item.after || ""));
      } else {
        span.textContent = item.label;
      }
      copy.appendChild(span);
    });
    return copy;
  }

  function buildRibbon(className, label, items) {
    const ribbon = doc.createElement("aside");
    ribbon.className = className;
    ribbon.setAttribute("role", "region");
    ribbon.setAttribute("aria-label", label);

    const viewport = doc.createElement("div");
    viewport.className = className + "__viewport";
    const track = doc.createElement("div");
    track.className = className + "__track";
    track.setAttribute("aria-hidden", "true");
    track.append(ribbonCopy(items, className, false), ribbonCopy(items, className, true));
    viewport.appendChild(track);
    ribbon.appendChild(viewport);
    return ribbon;
  }

  function initConversionRibbons() {
    ensureMotionStyles();
    root.classList.add("has-conversion-motion");

    const header = qs(".site-header");
    if (header && !qs(".announcement-ribbon")) {
      const announcement = buildRibbon(
        "announcement-ribbon",
        "Store benefits: free US shipping over 75 dollars, a 30-day happiness guarantee, small-batch freshness, and secure checkout",
        [
          { label: "Free US shipping over $75" },
          { label: "30-day happiness guarantee" },
          { label: "Small-batch freshness" },
          { label: "Secure checkout" },
          { label: "Wildcrafted in Ecuador" }
        ]
      );
      header.parentNode.insertBefore(announcement, header);
    }

    const blends = qs("#blends");
    if (blends && !qs(".journey-ribbon")) {
      const journeyRibbon = buildRibbon(
        "journey-ribbon",
        "From Ecuadorian harvest to your daily ritual",
        [
          { before: "Meet the ", emphasis: "plants", after: " behind every pouch" },
          { before: "Harvested by ", emphasis: "hand", after: " in Ecuador" },
          { before: "Learn the ", emphasis: "ritual", after: " before you steep" },
          { before: "Choose by ", emphasis: "concern", after: ", not guesswork" },
          { before: "Small batch. ", emphasis: "Fresh", after: " by design" }
        ]
      );
      blends.parentNode.insertBefore(journeyRibbon, blends);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Native product rail                                                        */
  /* -------------------------------------------------------------------------- */

  function initProductRail() {
    const rail = qs("#productRail, #product-rail");
    if (!rail) return;
    const previous = qs("#productPrev, #products-prev, [data-product-prev]");
    const next = qs("#productNext, #products-next, [data-product-next]");
    if (!rail.hasAttribute("tabindex")) rail.tabIndex = 0;
    rail.setAttribute("aria-roledescription", "carousel");
    qsa("img, a", rail).forEach((element) => element.setAttribute("draggable", "false"));
    let updateQueued = false;
    let dragging = false;
    let didDrag = false;
    let startX = 0;
    let startLeft = 0;
    let pointerId = null;

    function cardStep() {
      const card = qs("[data-product-card], .product-card", rail) || rail.firstElementChild;
      if (!card) return Math.max(260, rail.clientWidth * 0.8);
      const style = window.getComputedStyle(rail);
      const gap = Number.parseFloat(style.columnGap || style.gap || "0") || 24;
      return card.getBoundingClientRect().width + gap;
    }

    function scrollByCard(direction) {
      rail.scrollBy({ left: direction * cardStep(), behavior: isReduced() ? "auto" : "smooth" });
    }

    function updateArrows() {
      updateQueued = false;
      const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      if (previous) previous.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max - 2 || max <= 1;
    }

    function requestArrowUpdate() {
      if (updateQueued) return;
      updateQueued = true;
      window.requestAnimationFrame(updateArrows);
    }

    on(previous, "click", () => scrollByCard(-1));
    on(next, "click", () => scrollByCard(1));
    on(rail, "scroll", requestArrowUpdate, { passive: true });
    on(rail, "keydown", (event) => {
      if (event.target !== rail) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollByCard(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollByCard(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        rail.scrollTo({ left: 0, behavior: isReduced() ? "auto" : "smooth" });
      } else if (event.key === "End") {
        event.preventDefault();
        rail.scrollTo({ left: rail.scrollWidth, behavior: isReduced() ? "auto" : "smooth" });
      }
    });

    on(rail, "pointerdown", (event) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      didDrag = false;
      pointerId = event.pointerId;
      startX = event.clientX;
      startLeft = rail.scrollLeft;
    });
    on(rail, "pointermove", (event) => {
      if (!dragging || event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 5) {
        didDrag = true;
        rail.classList.add("is-dragging");
        if (!rail.hasPointerCapture || !rail.hasPointerCapture(pointerId)) {
          safe(() => rail.setPointerCapture(pointerId));
        }
        event.preventDefault();
      }
      rail.scrollLeft = startLeft - delta;
    });
    function endDrag(event) {
      if (!dragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      dragging = false;
      rail.classList.remove("is-dragging");
      safe(() => rail.releasePointerCapture(pointerId));
      pointerId = null;
      requestArrowUpdate();
    }
    on(rail, "pointerup", endDrag);
    on(rail, "pointercancel", endDrag);
    on(rail, "dragstart", (event) => event.preventDefault());
    on(
      rail,
      "click",
      (event) => {
        if (!didDrag) return;
        event.preventDefault();
        event.stopPropagation();
        didDrag = false;
      },
      true
    );

    if ("ResizeObserver" in window) new ResizeObserver(requestArrowUpdate).observe(rail);
    on(window, "load", requestArrowUpdate, { once: true });
    updateArrows();
  }

  function initProductRailAutoplay() {
    const rail = qs("#productRail, #product-rail");
    if (!rail) return;
    const cards = qsa("[data-product-card], .product-card", rail);
    if (cards.length < 2) return;

    const section = rail.closest(".blends-section") || rail.parentElement;
    const previous = qs("#productPrev, #products-prev, [data-product-prev]");
    const next = qs("#productNext, #products-next, [data-product-next]");
    const pauses = new Set();
    let timer = 0;
    let intentTimer = 0;

    function clearTimer() {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    }

    function targets() {
      const origin = cards[0].offsetLeft;
      return cards.map((card) => Math.max(0, card.offsetLeft - origin));
    }

    function closestIndex() {
      const positions = targets();
      return positions.reduce(
        (best, position, index) =>
          Math.abs(position - rail.scrollLeft) < best.distance
            ? { index: index, distance: Math.abs(position - rail.scrollLeft) }
            : best,
        { index: 0, distance: Infinity }
      ).index;
    }

    function schedule() {
      clearTimer();
      rail.classList.toggle("is-auto-paused", pauses.size > 0 || isReduced());
      rail.classList.toggle("is-auto-advancing", pauses.size === 0 && !isReduced());
      if (pauses.size || isReduced() || doc.hidden) return;
      timer = window.setTimeout(() => {
        const positions = targets();
        const nextIndex = (closestIndex() + 1) % positions.length;
        rail.scrollTo({ left: positions[nextIndex], behavior: "smooth" });
        schedule();
      }, 4600);
    }

    function pause(reason) {
      pauses.add(reason);
      schedule();
    }

    function resume(reason) {
      pauses.delete(reason);
      schedule();
    }

    function pauseForIntent() {
      pause("intent");
      if (intentTimer) window.clearTimeout(intentTimer);
      intentTimer = window.setTimeout(() => resume("intent"), 4200);
    }

    on(rail, "mouseenter", () => pause("hover"));
    on(rail, "mouseleave", () => resume("hover"));
    on(rail, "pointerdown", () => pause("drag"));
    on(rail, "pointerup", () => window.setTimeout(() => resume("drag"), 650));
    on(rail, "pointercancel", () => resume("drag"));
    on(rail, "lostpointercapture", () => resume("drag"));
    on(rail, "wheel", pauseForIntent, { passive: true });
    on(rail, "keydown", pauseForIntent);
    on(section, "focusin", () => pause("focus"));
    on(section, "focusout", (event) => {
      if (!section.contains(event.relatedTarget)) resume("focus");
    });
    on(previous, "click", pauseForIntent);
    on(next, "click", pauseForIntent);
    on(doc, "visibilitychange", () => {
      if (doc.hidden) pause("hidden");
      else resume("hidden");
    });
    on(reduceMotionQuery, "change", schedule);

    if ("IntersectionObserver" in window) {
      pause("offscreen");
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0] && entries[0].isIntersecting) resume("offscreen");
          else pause("offscreen");
        },
        { threshold: 0.12 }
      );
      observer.observe(rail);
      on(window, "pagehide", () => observer.disconnect(), { once: true });
    }

    on(window, "pagehide", () => {
      clearTimer();
      if (intentTimer) window.clearTimeout(intentTimer);
    }, { once: true });
    schedule();
  }

  /* -------------------------------------------------------------------------- */
  /* Retreat facade lightbox                                                    */
  /* -------------------------------------------------------------------------- */

  function youtubeIdFromUrl(url) {
    const value = String(url || "");
    const match = value.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i);
    return match ? match[1] : "MHHxiENWMho";
  }

  function initRetreatLightbox() {
    const dialog = qs("#retreatDialog, #retreat-dialog");
    const openers = qsa("#retreatOpen, #retreat-open, [data-retreat-open], [data-open-retreat], .retreat-play");
    if (!dialog || !openers.length) return;
    const closeButton = qs("#retreatClose, #retreat-close, [data-retreat-close]", dialog);
    let mount = qs("#retreatVideoMount, #retreat-video-mount, [data-video-mount]", dialog);
    if (!mount) {
      mount = doc.createElement("div");
      mount.className = "retreat-video-mount";
      mount.setAttribute("data-video-mount", "");
      dialog.appendChild(mount);
    }
    let opened = false;
    let activeOpener = null;
    const trap = createFocusTrap(dialog, closeDialog);

    function createVideo(opener) {
      const supplied = opener.dataset.youtubeUrl || dialog.dataset.youtubeUrl || "https://youtu.be/MHHxiENWMho";
      const id = youtubeIdFromUrl(supplied);
      const iframe = doc.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0&modestbranding=1";
      iframe.title = "Kawsaypac Ecuador retreat film";
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.className = "retreat-video-frame";
      mount.replaceChildren(iframe);
    }

    function openDialog(opener) {
      if (opened) return;
      opened = true;
      activeOpener = opener;
      dialog.hidden = false;
      dialog.classList.add("is-open");
      dialog.setAttribute("aria-hidden", "false");
      createVideo(opener);
      lockScroll("retreat-dialog");
      body.classList.add("dialog-open");
      if (dialog.tagName === "DIALOG" && typeof dialog.showModal === "function" && !dialog.open) {
        safe(() => dialog.showModal());
      }
      trap.activate(closeButton || focusableElements(dialog)[0]);
    }

    function cleanupDialog() {
      mount.replaceChildren();
      unlockScroll("retreat-dialog");
      body.classList.remove("dialog-open");
      dialog.classList.remove("is-open");
      dialog.setAttribute("aria-hidden", "true");
      dialog.hidden = true;
      if (activeOpener && doc.contains(activeOpener)) safe(() => activeOpener.focus({ preventScroll: true }));
      activeOpener = null;
    }

    function closeDialog() {
      if (!opened) return;
      opened = false;
      trap.deactivate(false);
      if (dialog.tagName === "DIALOG" && dialog.open && typeof dialog.close === "function") {
        safe(() => dialog.close());
      }
      cleanupDialog();
    }

    openers.forEach((opener) => {
      opener.setAttribute("aria-haspopup", "dialog");
      opener.setAttribute("aria-controls", dialog.id);
      on(opener, "click", (event) => {
        event.preventDefault();
        openDialog(opener);
      });
    });
    on(closeButton, "click", closeDialog);
    on(dialog, "click", (event) => {
      if (event.target === dialog) closeDialog();
    });
    on(dialog, "cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });
    on(dialog, "close", () => {
      if (opened) {
        opened = false;
        trap.deactivate(false);
        cleanupDialog();
      }
    });
    dialog.hidden = true;
    dialog.setAttribute("aria-hidden", "true");
  }

  /* -------------------------------------------------------------------------- */
  /* Rotating testimonials and hero thumbnail carousel                          */
  /* -------------------------------------------------------------------------- */

  function initTestimonials() {
    const region = qs("#testimonialPanel, #testimonials");
    if (!region) return;
    const slides = qsa("[data-testimonial]", region);
    if (!slides.length) return;
    const previous = qs("#testimonialPrev, #testimonial-prev, [data-testimonial-prev]", region) || qs("#testimonialPrev, #testimonial-prev, [data-testimonial-prev]");
    const next = qs("#testimonialNext, #testimonial-next, [data-testimonial-next]", region) || qs("#testimonialNext, #testimonial-next, [data-testimonial-next]");
    const dots = qsa("[data-testimonial-dot]", region);
    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active") || slide.getAttribute("aria-hidden") === "false"));
    let timer = 0;
    const pauses = new Set();

    function normalize() {
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === index;
        slide.hidden = !active;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
        slide.setAttribute("aria-current", active ? "true" : "false");
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
        dot.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    function show(nextIndex, userInitiated) {
      const normalized = (nextIndex + slides.length) % slides.length;
      if (normalized === index) return;
      const oldSlide = slides[index];
      const newSlide = slides[normalized];
      index = normalized;
      const gsap = window.gsap;

      slides.forEach((slide, slideIndex) => {
        if (slide !== oldSlide && slide !== newSlide) {
          slide.hidden = true;
          slide.classList.remove("is-active");
          slide.setAttribute("aria-hidden", "true");
          slide.setAttribute("aria-current", "false");
        }
      });
      newSlide.hidden = false;
      newSlide.classList.add("is-active");
      newSlide.setAttribute("aria-hidden", "false");
      newSlide.setAttribute("aria-current", "true");
      oldSlide.classList.remove("is-active");
      oldSlide.setAttribute("aria-hidden", "true");
      oldSlide.setAttribute("aria-current", "false");

      if (gsap && !isReduced()) {
        safe(() => {
          gsap.killTweensOf([oldSlide, newSlide]);
          gsap.fromTo(
            newSlide,
            { autoAlpha: 0, y: 9 },
            { autoAlpha: 1, y: 0, duration: 0.42, delay: 0.1, ease: "power2.out", clearProps: "opacity,visibility,transform" }
          );
          gsap.to(oldSlide, {
            autoAlpha: 0,
            y: -7,
            duration: 0.25,
            ease: "power1.out",
            onComplete() {
              oldSlide.hidden = true;
              gsap.set(oldSlide, { clearProps: "opacity,visibility,transform" });
            }
          });
        });
      } else {
        oldSlide.hidden = true;
      }
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
        dot.setAttribute("aria-pressed", active ? "true" : "false");
      });
      if (userInitiated) schedule();
    }

    function clearTimer() {
      if (timer) window.clearTimeout(timer);
      timer = 0;
    }

    function schedule() {
      clearTimer();
      if (slides.length < 2 || isReduced() || pauses.size || doc.hidden) return;
      timer = window.setTimeout(() => {
        show(index + 1, false);
        schedule();
      }, 6000);
    }

    function pause(reason) {
      pauses.add(reason);
      clearTimer();
    }

    function resume(reason) {
      pauses.delete(reason);
      schedule();
    }

    on(previous, "click", () => show(index - 1, true));
    on(next, "click", () => show(index + 1, true));
    dots.forEach((dot, dotIndex) => on(dot, "click", () => show(dotIndex, true)));
    on(region, "mouseenter", () => pause("hover"));
    on(region, "mouseleave", () => resume("hover"));
    on(region, "focusin", () => pause("focus"));
    on(region, "focusout", (event) => {
      if (!region.contains(event.relatedTarget)) resume("focus");
    });
    on(doc, "visibilitychange", () => {
      if (doc.hidden) pause("hidden");
      else resume("hidden");
    });
    on(reduceMotionQuery, "change", schedule);
    normalize();
    schedule();
  }

  function initHeroThumbs() {
    const thumbs = qsa("[data-hero-thumb]");
    if (thumbs.length < 2) return;
    const container = thumbs[0].closest("[data-hero-carousel], .hero-ritual-card") || thumbs[0].parentElement;
    const dots = qsa("[data-hero-dot]", container || doc);
    let index = Math.max(0, thumbs.findIndex((thumb) => thumb.classList.contains("is-active")));
    let timer = 0;
    const pauses = new Set();

    function render(nextIndex) {
      index = (nextIndex + thumbs.length) % thumbs.length;
      thumbs.forEach((thumb, thumbIndex) => {
        const active = thumbIndex === index;
        thumb.hidden = !active;
        thumb.classList.toggle("is-active", active);
        thumb.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", active ? "true" : "false");
        dot.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    function schedule() {
      if (timer) window.clearTimeout(timer);
      timer = 0;
      if (isReduced() || pauses.size || doc.hidden) return;
      timer = window.setTimeout(() => {
        render(index + 1);
        schedule();
      }, 4000);
    }

    dots.forEach((dot, dotIndex) => on(dot, "click", () => {
      render(dotIndex);
      schedule();
    }));
    if (container) {
      on(container, "mouseenter", () => {
        pauses.add("hover");
        schedule();
      });
      on(container, "mouseleave", () => {
        pauses.delete("hover");
        schedule();
      });
      on(container, "focusin", () => {
        pauses.add("focus");
        schedule();
      });
      on(container, "focusout", (event) => {
        if (!container.contains(event.relatedTarget)) pauses.delete("focus");
        schedule();
      });
    }
    on(doc, "visibilitychange", schedule);
    on(reduceMotionQuery, "change", schedule);
    render(index);
    schedule();
  }

  /* -------------------------------------------------------------------------- */
  /* Newsletter validation                                                      */
  /* -------------------------------------------------------------------------- */

  function initNewsletter() {
    const form = qs("#journalForm, #journal-form");
    const email = qs("#journalEmail, #journal-email, input[type='email']", form || doc);
    const status = qs("#journalStatus, #journal-status, [data-form-status]", form || doc);
    const error = qs("#journal-error, [data-form-error]", form || doc);
    if (!form || !email || !status) return;
    status.setAttribute("aria-live", "polite");
    status.setAttribute("role", "status");

    function setState(type, message) {
      form.classList.remove("has-error", "is-success");
      if (type) form.classList.add(type === "success" ? "is-success" : "has-error");
      status.dataset.state = type || "idle";
      status.textContent = type === "success" ? message || "" : "";
      if (error) {
        error.hidden = type !== "error";
        error.textContent = type === "error" ? message || "" : "";
      } else if (type === "error") {
        status.textContent = message || "";
      }
      email.setAttribute("aria-invalid", String(type === "error"));
    }

    on(email, "input", () => {
      if (form.classList.contains("has-error")) setState("", "");
    });
    on(form, "submit", (event) => {
      event.preventDefault();
      const value = email.value.trim();
      if (!value) {
        setState("error", "Please enter your email address.");
        email.focus();
        return;
      }
      if (!email.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setState("error", "Please enter a valid email address.");
        email.focus();
        return;
      }
      const endpoint = form.getAttribute("action");
      if (!endpoint || endpoint === "#") {
        setState("success", "Preview validated. Live email capture connects with the newsletter provider at launch.");
        return;
      }
      setState("success", "Thank you. Your journal subscription is being processed.");
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Ambient cursor glint                                                       */
  /* -------------------------------------------------------------------------- */

  function initCursorGlint() {
    if (!finePointerQuery.matches || isReduced()) return;
    const glint = qs(".cursor-glint");
    let frame = 0;
    let x = 0;
    let y = 0;
    let active = false;
    body.classList.add("has-cursor-glint");

    function paint() {
      frame = 0;
      root.style.setProperty("--cursor-x", x + "px");
      root.style.setProperty("--cursor-y", y + "px");
      body.classList.toggle("cursor-glint-active", active);
      if (glint) {
        glint.style.transform = "translate3d(" + (x - 150) + "px," + (y - 150) + "px,0)";
        glint.style.opacity = active ? "0.48" : "0";
      }
    }

    on(doc, "pointermove", (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      const excluded = target && target.closest("[data-no-glint], #hero, .hero, #retreats, .retreats, #testimonials, footer");
      const explicitlyCream = target && target.closest("[data-glint], [data-theme='cream'], .cream-section, main");
      active = Boolean(explicitlyCream && !excluded);
      if (!frame) frame = window.requestAnimationFrame(paint);
    }, { passive: true });
    on(doc, "pointerleave", () => {
      active = false;
      if (!frame) frame = window.requestAnimationFrame(paint);
    });
  }

  /* -------------------------------------------------------------------------- */
  /* Hummingbird companion                                                      */
  /* -------------------------------------------------------------------------- */

  function flyingHummingbirdMarkup() {
    return (
      '<svg viewBox="0 0 120 76" aria-hidden="true" focusable="false">' +
        '<g class="hb-wing-upper">' +
          '<path d="M51 38C33 25 20 8 17 2c18 3 35 11 45 26-2-13 3-23 12-28 2 17-2 31-12 42Z" fill="#D7BC65" fill-opacity=".92"/>' +
          '<path d="M54 35C39 24 30 13 26 8c14 5 26 13 34 25Z" fill="#FAF9F6" fill-opacity=".62"/>' +
        '</g>' +
        '<g class="hb-wing-lower">' +
          '<path d="M53 41C34 40 17 47 8 59c19-5 36-4 52 3Z" fill="#A17E16" fill-opacity=".78"/>' +
        '</g>' +
        '<path d="M47 38c11-11 28-12 39-3 7 6 10 13 8 19-14 3-27 1-38-6-5-3-8-6-9-10Z" fill="#2C4A37"/>' +
        '<path d="M55 45c11 2 22 1 33-4-3 9-12 15-25 14Z" fill="#D7BC65"/>' +
        '<path d="M84 35c7-7 15-6 21-1-3 7-9 11-17 10Z" fill="#1F3A2A"/>' +
        '<circle cx="99" cy="34" r="2.25" fill="#FAF9F6"/>' +
        '<path d="M105 37 119 41 105 40Z" fill="#A17E16"/>' +
        '<path d="M49 47 31 67 53 54M55 50 43 72 62 55" fill="#1F3A2A"/>' +
      '</svg>'
    );
  }

  function perchedHummingbirdMarkup() {
    return (
      '<svg viewBox="0 0 118 74" aria-hidden="true" focusable="false">' +
        '<path d="M47 36C30 23 21 9 18 3c16 4 30 12 39 26 0-11 5-20 13-25 1 14-3 27-12 36Z" fill="#D7BC65" fill-opacity=".9"/>' +
        '<path d="M49 39c12-10 29-9 39 1 5 5 7 11 5 16-15 3-29-1-42-10Z" fill="#FAF9F6"/>' +
        '<path d="M58 48c11 1 21-1 30-6-4 9-13 14-25 13Z" fill="#D7BC65"/>' +
        '<path d="M84 39c7-6 15-5 20 1-4 6-10 9-18 7Z" fill="#C9A942"/>' +
        '<circle cx="98" cy="40" r="2" fill="#1F3A2A"/>' +
        '<path d="m104 42 13 4-14-1Z" fill="#D7BC65"/>' +
        '<path d="M54 52 39 67 57 57M61 54 53 70 66 57" fill="none" stroke="#D7BC65" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M31 68c23-4 46-3 68 2" fill="none" stroke="#D7BC65" stroke-width="1.5" stroke-linecap="round" opacity=".72"/>' +
      '</svg>'
    );
  }

  function initHummingbird() {
    const prototype = qs("#hummingbird");
    if (prototype) prototype.remove();

    const panel = qs("#testimonialPanel, #testimonials");
    if (panel && !qs(".testimonial-hummingbird", panel)) {
      const perched = doc.createElement("span");
      perched.className = "testimonial-hummingbird";
      perched.setAttribute("aria-hidden", "true");
      perched.innerHTML = perchedHummingbirdMarkup();
      panel.appendChild(perched);
    }

    const hero = qs("#hero");
    const finalFlightSection = qs("#testimonials");
    if (!hero || !finalFlightSection || isReduced() || !finePointerQuery.matches) return;

    let bird = qs(".journey-hummingbird");
    if (!bird) {
      bird = doc.createElement("span");
      bird.className = "journey-hummingbird";
      bird.setAttribute("aria-hidden", "true");
      bird.innerHTML = flyingHummingbirdMarkup();
      body.appendChild(bird);
    }

    const path = [
      { x: 0.072, y: 0.22 },
      { x: 0.052, y: 0.34 },
      { x: 0.078, y: 0.24 },
      { x: 0.055, y: 0.62 },
      { x: 0.074, y: 0.43 },
      { x: 0.05, y: 0.28 },
      { x: 0.07, y: 0.58 }
    ];
    let frame = 0;

    function paintFlight() {
      frame = 0;
      /* On compact desktop widths there is no true visual gutter. Keep the
         companion out of the content entirely, then use the far-left edge on
         wide canvases so it never flies through a headline, CTA, or ledger. */
      if (isReduced() || window.innerWidth < 1400 || doc.hidden) {
        bird.classList.remove("is-visible");
        return;
      }

      const start = hero.offsetTop + hero.offsetHeight + window.innerHeight * 0.18;
      const end = finalFlightSection.offsetTop + finalFlightSection.offsetHeight - window.innerHeight * 0.35;
      const readingLine = window.scrollY + window.innerHeight * 0.38;
      const progress = clamp(0, (readingLine - start) / Math.max(1, end - start), 1);
      const insideJourney = readingLine >= start && readingLine <= end;
      bird.classList.toggle("is-visible", insideJourney);
      if (!insideJourney) return;

      const scaled = progress * (path.length - 1);
      const index = Math.min(path.length - 2, Math.floor(scaled));
      const local = scaled - index;
      const eased = local * local * (3 - 2 * local);
      const from = path[index];
      const to = path[index + 1];
      const xRatio = from.x + (to.x - from.x) * eased;
      const yRatio = from.y + (to.y - from.y) * eased;
      const direction = to.x >= from.x ? 1 : -1;
      const x = clamp(20, xRatio * window.innerWidth - 34, window.innerWidth - 88);
      const y = clamp(105, yRatio * window.innerHeight, window.innerHeight - 90);
      const angle = clamp(-7, (to.y - from.y) * 26, 7);
      bird.style.transform =
        "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) " +
        "scaleX(" + direction + ") rotate(" + (angle * direction).toFixed(2) + "deg)";
    }

    function queueFlight() {
      if (!frame) frame = window.requestAnimationFrame(paintFlight);
    }

    on(window, "scroll", queueFlight, { passive: true });
    on(window, "resize", queueFlight, { passive: true });
    on(doc, "visibilitychange", queueFlight);
    on(reduceMotionQuery, "change", queueFlight);
    on(window, "pagehide", () => {
      if (frame) window.cancelAnimationFrame(frame);
    }, { once: true });
    queueFlight();
  }

  /* -------------------------------------------------------------------------- */
  /* Living flora ornaments                                                     */
  /* -------------------------------------------------------------------------- */

  function initLivingFlora() {
    if (qs(".living-flora-layer")) return;

    let pageKey = body.getAttribute("data-page") || "home";
    if (body.classList.contains("page-learn")) pageKey = "learn";
    if (body.classList.contains("page-brand")) pageKey = "brand";
    if (body.classList.contains("page-apothecary")) pageKey = "apothecary";
    if (body.classList.contains("page-product")) pageKey = "product";

    const assets = {
      passion: { src: "assets/img/floaters/passionflower-vine.webp", width: 848, height: 1239 },
      guayusa: { src: "assets/img/floaters/guayusa-sprig.webp", width: 1065, height: 1254 },
      petals: { src: "assets/img/floaters/dried-petals-drift.webp", width: 1180, height: 1214 },
      pouch: { src: "assets/img/floaters/kraft-pouch-tilt.webp", width: 926, height: 1216 }
    };

    const layouts = {
      home: [
        { asset: "passion", side: "right", top: 11, size: "clamp(126px, 11vw, 210px)", opacity: 0.78 },
        { asset: "petals", side: "left", top: 31, size: "clamp(118px, 10vw, 186px)", opacity: 0.7, optional: true },
        { asset: "guayusa", side: "right", top: 57, size: "clamp(128px, 11vw, 210px)", opacity: 0.78 },
        { asset: "pouch", side: "left", top: 79, size: "clamp(120px, 10vw, 188px)", opacity: 0.8, optional: true }
      ],
      learn: [
        { asset: "passion", side: "right", top: 14, size: "clamp(122px, 10vw, 196px)", opacity: 0.78 },
        { asset: "petals", side: "left", top: 44, size: "clamp(110px, 9vw, 172px)", opacity: 0.66, optional: true },
        { asset: "guayusa", side: "right", top: 74, size: "clamp(120px, 10vw, 194px)", opacity: 0.74 }
      ],
      brand: [
        { asset: "guayusa", side: "right", top: 18, size: "clamp(126px, 11vw, 210px)", opacity: 0.74 },
        { asset: "passion", side: "left", top: 48, size: "clamp(118px, 10vw, 190px)", opacity: 0.75 },
        { asset: "petals", side: "right", top: 78, size: "clamp(108px, 9vw, 168px)", opacity: 0.64, optional: true }
      ],
      apothecary: [
        { asset: "passion", side: "right", top: 16, size: "clamp(128px, 11vw, 214px)", opacity: 0.8 },
        { asset: "guayusa", side: "left", top: 47, size: "clamp(118px, 10vw, 198px)", opacity: 0.72 },
        { asset: "petals", side: "right", top: 76, size: "clamp(110px, 9vw, 174px)", opacity: 0.64, optional: true }
      ],
      product: [
        { asset: "pouch", side: "right", top: 17, size: "clamp(126px, 11vw, 205px)", opacity: 0.8 },
        { asset: "guayusa", side: "left", top: 48, size: "clamp(120px, 10vw, 196px)", opacity: 0.74 },
        { asset: "petals", side: "right", top: 78, size: "clamp(110px, 9vw, 170px)", opacity: 0.62, optional: true }
      ],
      events: [
        { asset: "passion", side: "right", top: 17, size: "clamp(128px, 11vw, 210px)", opacity: 0.78 },
        { asset: "petals", side: "left", top: 49, size: "clamp(112px, 9vw, 176px)", opacity: 0.66 },
        { asset: "guayusa", side: "right", top: 79, size: "clamp(120px, 10vw, 198px)", opacity: 0.72, optional: true }
      ],
      shop: [
        { asset: "pouch", side: "right", top: 15, size: "clamp(130px, 11vw, 214px)", opacity: 0.82 },
        { asset: "guayusa", side: "left", top: 51, size: "clamp(120px, 10vw, 196px)", opacity: 0.72 },
        { asset: "petals", side: "right", top: 82, size: "clamp(108px, 9vw, 170px)", opacity: 0.62, optional: true }
      ],
      journal: [
        { asset: "passion", side: "right", top: 16, size: "clamp(126px, 10vw, 202px)", opacity: 0.78 },
        { asset: "petals", side: "left", top: 48, size: "clamp(112px, 9vw, 176px)", opacity: 0.65 },
        { asset: "guayusa", side: "right", top: 79, size: "clamp(118px, 10vw, 194px)", opacity: 0.72, optional: true }
      ]
    };

    const specs = layouts[pageKey] || layouts.home;
    const layer = doc.createElement("div");
    layer.className = "living-flora-layer";
    layer.setAttribute("aria-hidden", "true");

    specs.forEach((spec, index) => {
      const asset = assets[spec.asset];
      if (!asset) return;
      const wrapper = doc.createElement("span");
      wrapper.className =
        "living-flora living-flora--" + spec.side +
        " living-flora--" + spec.asset +
        (spec.optional ? " living-flora--optional" : "");
      wrapper.style.setProperty("--flora-top", spec.top + "%");
      wrapper.style.setProperty("--flora-size", spec.size);
      wrapper.style.setProperty("--flora-opacity", String(spec.opacity));
      wrapper.style.setProperty("--flora-speed", (8.1 + index * 1.15).toFixed(2) + "s");

      const image = doc.createElement("img");
      image.className = "living-flora__image";
      image.src = asset.src;
      image.alt = "";
      image.width = asset.width;
      image.height = asset.height;
      image.loading = "lazy";
      image.decoding = "async";
      wrapper.appendChild(image);
      layer.appendChild(wrapper);
    });

    body.appendChild(layer);

    if (!isReduced() && desktopQuery.matches && window.gsap && window.ScrollTrigger) {
      qsa(".living-flora", layer).forEach((floater, index) => {
        window.gsap.fromTo(
          floater,
          { yPercent: index % 2 ? -7 : 7 },
          {
            yPercent: index % 2 ? 10 : -10,
            ease: "none",
            scrollTrigger: {
              trigger: floater,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.1 + index * 0.15
            }
          }
        );
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Final progressive-enhancement safety net                                   */
  /* -------------------------------------------------------------------------- */

  function forceShowMotionTargets() {
    qsa("[data-hero-sequence], [data-reveal], .word-inner").forEach((element) => {
      const style = window.getComputedStyle(element);
      if (style.opacity === "0" || style.visibility === "hidden") {
        element.style.opacity = "1";
        element.style.visibility = "visible";
      }
    });
    root.classList.add("motion-safety-complete");
  }

  function initSafetyNet() {
    onWindowLoad(() => window.setTimeout(forceShowMotionTargets, 2600));
    window.setTimeout(forceShowMotionTargets, 7000);
  }

  function init() {
    body = doc.body || body;
    if (!body) return;
    initConversionRibbons();
    initMediaSafety();
    initDesktopMenus();
    initMobileMenu();
    initNavCompression();
    initSmoothScroll();
    initDetailsHash();
    initGsap();
    initCounters();
    initAltitudeLedger();
    initProductRail();
    initProductRailAutoplay();
    initRetreatLightbox();
    initTestimonials();
    initHeroThumbs();
    initNewsletter();
    initCursorGlint();
    initHummingbird();
    initLivingFlora();
    initSafetyNet();
  }

  if (doc.readyState === "loading") on(doc, "DOMContentLoaded", init, { once: true });
  else init();
})();
