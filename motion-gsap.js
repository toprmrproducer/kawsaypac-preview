(() => {
  if (!window.gsap || !window.ScrollTrigger) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const unique = (items) => [...new Set(items)];
  const revealTargets = unique([
    ...document.querySelectorAll('section h2, section h3, .section h2, .section h3'),
    ...document.querySelectorAll('.title-section, .heading-2, .section-description, .subtitle-wrapper'),
    ...document.querySelectorAll('[data-reveal]')
  ]).filter((element) => {
    if (element.closest('.home-banner-section, .navbar, .nav-menu, .footer')) return false;
    return element.getClientRects().length > 0;
  });

  revealTargets.forEach((element) => element.classList.add('kp-scroll-reveal'));

  const media = gsap.matchMedia();
  media.add(
    {
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set(revealTargets, { autoAlpha: 1, x: 0, clearProps: 'transform,opacity,visibility' });
        return;
      }

      gsap.set(revealTargets, {
        autoAlpha: 0,
        x: desktop ? -64 : -28,
        willChange: 'transform,opacity'
      });

      ScrollTrigger.batch(revealTargets, {
        start: 'clamp(top 88%)',
        once: true,
        interval: 0.08,
        batchMax: desktop ? 4 : 2,
        onEnter: (batch) => gsap.to(batch, {
          autoAlpha: 1,
          x: 0,
          duration: desktop ? 0.82 : 0.62,
          ease: 'power3.out',
          stagger: 0.08,
          overwrite: 'auto',
          clearProps: 'willChange'
        })
      });

      document.querySelectorAll('.cover-image, .product-image-cart, .image-cover').forEach((image) => {
        if (image.closest('.home-banner-section, .footer')) return;
        gsap.fromTo(image, { yPercent: -1.5 }, {
          yPercent: 1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: image,
            start: 'clamp(top bottom)',
            end: 'clamp(bottom top)',
            scrub: 0.8
          }
        });
      });
    }
  );

  const refresh = () => ScrollTrigger.refresh();
  if (document.fonts?.ready) document.fonts.ready.then(refresh);
  window.addEventListener('load', refresh, { once: true });
})();
