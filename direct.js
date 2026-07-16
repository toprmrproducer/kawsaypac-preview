(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The preview keeps the source commerce card anatomy, but checkout is not
  // connected yet. Remove the source cart/query surface before the interaction
  // runtime scans the page so it never makes a storefront API request.
  document.querySelectorAll('.w-commerce-commercecartwrapper').forEach((cart) => cart.remove());
  const commerceForms = [...document.querySelectorAll('form[data-node-type="commerce-add-to-cart-form"]')];
  commerceForms.forEach((form) => {
    form.removeAttribute('data-node-type');
    form.removeAttribute('data-commerce-sku-id');
    form.removeAttribute('data-commerce-product-id');
  });

  const productSlugs = {
    'River of Life': 'river-of-life',
    'Scales of Balance': 'scales-of-balance',
    'Sacred Sacral': 'sacred-sacral'
  };
  document.querySelectorAll('.collection-item-2').forEach((card) => {
    const name = card.querySelector('.name-product')?.textContent.trim();
    const slug = productSlugs[name];
    if (!slug) return;
    card.querySelectorAll('a.name-product, a.product-image-link').forEach((link) => {
      link.href = `shop.html#product-${slug}`;
    });
    card.querySelector('[data-node-type="commerce-add-to-cart-button"]')?.addEventListener('click', () => {
      window.location.href = `shop.html#product-${slug}`;
    });
  });

  document.querySelectorAll('[style*="opacity"]').forEach((element) => {
    if (getComputedStyle(element).opacity === '0') element.style.opacity = '1';
  });

  commerceForms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      document.querySelector('#shop')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    if (!link.classList.contains('w-lightbox')) {
      link.addEventListener('click', (event) => event.preventDefault());
    }
  });

  const dropdowns = [...document.querySelectorAll('.nav-dropdown')].filter((dropdown) => {
    return getComputedStyle(dropdown).display !== 'none' && dropdown.querySelector('.kp-dropdown-trigger');
  });
  const closeDropdown = (dropdown) => {
    const trigger = dropdown.querySelector('.kp-dropdown-trigger');
    const panel = dropdown.querySelector('.nav-dropdown-list');
    dropdown.classList.remove('kp-open', 'w--open');
    panel?.classList.remove('w--open');
    trigger?.setAttribute('aria-expanded', 'false');
  };
  const openDropdown = (dropdown, focusFirst = false) => {
    dropdowns.forEach((item) => { if (item !== dropdown) closeDropdown(item); });
    const trigger = dropdown.querySelector('.kp-dropdown-trigger');
    const panel = dropdown.querySelector('.nav-dropdown-list');
    dropdown.classList.add('kp-open', 'w--open');
    panel?.classList.add('w--open');
    trigger?.setAttribute('aria-expanded', 'true');
    if (focusFirst) panel?.querySelector('a')?.focus();
  };
  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.kp-dropdown-trigger');
    let closeTimer = 0;
    trigger?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      trigger.getAttribute('aria-expanded') === 'true' ? closeDropdown(dropdown) : openDropdown(dropdown);
    });
    trigger?.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openDropdown(dropdown, event.key === 'ArrowDown');
      }
      if (event.key === 'Escape') closeDropdown(dropdown);
    });
    dropdown.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      if (matchMedia('(hover: hover)').matches) openDropdown(dropdown);
    });
    dropdown.addEventListener('mouseleave', () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => closeDropdown(dropdown), 150);
    });
    dropdown.addEventListener('focusout', () => {
      setTimeout(() => { if (!dropdown.contains(document.activeElement)) closeDropdown(dropdown); }, 0);
    });
  });
  document.addEventListener('click', () => dropdowns.forEach(closeDropdown));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') dropdowns.forEach(closeDropdown);
  });

  const mobileMenu = document.querySelector('#mobile-navigation');
  const mobileMenuOpen = document.querySelector('.menu-button');
  const mobileMenuClose = document.querySelector('.close-menu-button');
  const mobileBackground = [
    document.querySelector('main'),
    document.querySelector('#footer'),
    document.querySelector('.kp-conversion-ribbon'),
    document.querySelector('.search-desktop')
  ].filter(Boolean);
  const setMobileMenu = (open, returnFocus = false) => {
    mobileMenu?.classList.toggle('kp-mobile-open', open);
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('kp-menu-open', open);
    mobileMenuOpen?.setAttribute('aria-expanded', String(open));
    mobileBackground.forEach((region) => {
      region.inert = open;
      if (open) region.setAttribute('aria-hidden', 'true');
      else region.removeAttribute('aria-hidden');
    });
    if (open) mobileMenuClose?.focus();
    if (!open && returnFocus) mobileMenuOpen?.focus();
  };
  mobileMenu?.setAttribute('aria-hidden', 'true');
  mobileMenuOpen?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setMobileMenu(mobileMenuOpen.getAttribute('aria-expanded') !== 'true');
  });
  mobileMenuClose?.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    setMobileMenu(false, true);
  });
  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMobileMenu(false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('kp-menu-open')) setMobileMenu(false, true);
  });
  mobileMenu?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !document.body.classList.contains('kp-menu-open')) return;
    const focusable = [...mobileMenu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  matchMedia('(min-width: 992px)').addEventListener('change', (event) => {
    if (event.matches && document.body.classList.contains('kp-menu-open')) setMobileMenu(false);
  });

  const testimonialStories = [
    {
      quote: '“These blends have truly transformed my energy and wellbeing.”',
      name: 'Maria S.',
      place: 'Quito · Energy ritual',
      image: 'assets/img/testimonials/testimonial-02.webp'
    },
    {
      quote: '“I feel more balanced, more grounded, and more like myself.”',
      name: 'David L.',
      place: 'Austin · Nervous system support',
      image: 'assets/img/testimonials/testimonial-07.webp'
    },
    {
      quote: '“The quality is unlike anything I have found. Deeply grateful.”',
      name: 'Ana P.',
      place: 'Vancouver · Daily wellness',
      image: 'assets/img/testimonials/testimonial-03.webp'
    },
    {
      quote: '“I started for the sleep blend. I stayed because I finally understood what I was putting in my body, and where it came from.”',
      name: 'Rebecca M.',
      place: 'Portland · Sleep ritual',
      image: 'assets/img/testimonials/testimonial-01.webp'
    },
    {
      quote: '“The preparation guide made the herbs feel approachable from the very first cup.”',
      name: 'Elena R.',
      place: 'Miami · Herbal education',
      image: 'assets/img/testimonials/testimonial-05.webp'
    },
    {
      quote: '“You can taste the freshness—and the care behind every ingredient.”',
      name: 'Jordan T.',
      place: 'Toronto · Digestive support',
      image: 'assets/img/testimonials/testimonial-08.webp'
    }
  ];
  const testimonialSection = document.querySelector('.loop-wraper')?.closest('section');
  testimonialSection?.classList.add('kp-testimonials-section');
  document.querySelectorAll('.testimonials-card').forEach((card, index) => {
    const story = testimonialStories[index % testimonialStories.length];
    const quote = card.querySelector('.paragraph-large');
    const name = card.querySelector('.review-name');
    const place = name?.nextElementSibling;
    const portrait = card.querySelector('.author-image');
    if (quote) quote.textContent = story.quote;
    if (name) name.textContent = story.name;
    if (place) place.textContent = story.place;
    if (portrait) {
      portrait.src = story.image;
      portrait.alt = `Illustrative portrait for ${story.name}'s customer story`;
      portrait.removeAttribute('srcset');
      portrait.removeAttribute('sizes');
    }
  });

  const addHummingbird = (host, className, source) => {
    if (!host || host.querySelector(`.${className}`)) return;
    host.classList.add('kp-bird-host');
    const bird = document.createElement('span');
    bird.className = className;
    bird.setAttribute('aria-hidden', 'true');
    const image = document.createElement('img');
    image.src = source;
    image.alt = '';
    image.width = 512;
    image.height = 512;
    bird.append(image);
    host.append(bird);
  };

  addHummingbird(
    testimonialSection,
    'kp-bird-perched',
    'assets/sprites/hummingbirds/hummingbird-perched.webp'
  );

  const retreatHeading = [...document.querySelectorAll('h2')].find((heading) => {
    return /step away|enter the living tradition|what guests carry home/i.test(heading.textContent);
  });
  addHummingbird(
    retreatHeading?.closest('section, .section, .dark-background'),
    'kp-bird-flight',
    'assets/sprites/hummingbirds/hummingbird-flight.webp'
  );

  const lightboxJson = document.querySelector('.home-banner-section .w-json');
  if (lightboxJson) {
    try {
      const config = JSON.parse(lightboxJson.textContent);
      const item = config.items?.[0];
      if (item) {
        item.url = 'https://youtu.be/MHHxiENWMho';
        item.originalUrl = 'https://youtu.be/MHHxiENWMho';
        item.thumbnailUrl = 'assets/img/hero-ritual-thumb.webp';
      }
      lightboxJson.textContent = JSON.stringify(config);
    } catch {}
  }

  const vimeoFrame = document.querySelector('.hero-vimeo-bg iframe');
  const onVimeoMessage = (event) => {
    if (!event.origin.includes('vimeo.com')) return;
    try {
      const message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (message?.event === 'ready') {
        vimeoFrame?.parentElement?.classList.add('is-ready');
        window.removeEventListener('message', onVimeoMessage);
      }
    } catch {}
  };
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (vimeoFrame && !navigator.webdriver && !connection?.saveData && matchMedia('(min-width: 992px) and (prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('message', onVimeoMessage);
    window.addEventListener('load', () => {
      setTimeout(() => { vimeoFrame.src = vimeoFrame.dataset.src; }, 900);
    }, { once: true });
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!reducedMotion && finePointer) {
    const glint = document.createElement('div');
    glint.className = 'kp-cursor-glint';
    glint.ariaHidden = 'true';
    document.body.append(glint);

    let pointerX = -100;
    let pointerY = -100;
    let pointerFrame = 0;
    const paintPointer = () => {
      pointerFrame = 0;
      glint.style.left = `${pointerX}px`;
      glint.style.top = `${pointerY}px`;
    };
    window.addEventListener('pointermove', (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      glint.classList.add('is-visible');
      if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => glint.classList.remove('is-visible'));

    document.querySelectorAll('.primary-button-link, .primary-button-white, .primary-button-white-small, .primary-button-small').forEach((button) => {
      button.classList.add('kp-magnetic');
      button.addEventListener('pointermove', (event) => {
        const bounds = button.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) * .12;
        const y = (event.clientY - bounds.top - bounds.height / 2) * .12;
        button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });

    document.querySelectorAll('.collection-item-2, .home-7-blog-item, .lightbox-link').forEach((card) => {
      const visual = card.querySelector('img:not(.icon-feature)');
      if (!visual) return;
      visual.classList.add('kp-tilt-image');
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const rx = ((event.clientY - bounds.top) / bounds.height - .5) * -3;
        const ry = ((event.clientX - bounds.left) / bounds.width - .5) * 3;
        visual.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.018)`;
        visual.style.filter = 'saturate(1.04)';
      });
      card.addEventListener('pointerleave', () => {
        visual.style.transform = '';
        visual.style.filter = '';
      });
    });
  }

})();
