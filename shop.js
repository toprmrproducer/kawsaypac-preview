(() => {
  "use strict";

  const catalog = document.querySelector("[data-shop-catalog]");
  if (!catalog) return;

  const concernNav = document.querySelector(".shop-nav-concern");
  document.addEventListener("click", (event) => {
    if (concernNav?.open && !concernNav.contains(event.target)) concernNav.removeAttribute("open");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && concernNav?.open) {
      concernNav.removeAttribute("open");
      concernNav.querySelector("summary")?.focus();
    }
  });
  concernNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => concernNav.removeAttribute("open"));
  });

  const filterInputs = Array.from(catalog.querySelectorAll('input[name="shop-filter"]'));
  const productCards = Array.from(catalog.querySelectorAll("[data-shop-product]"));
  const status = catalog.querySelector("[data-shop-status]");
  const concernFilters = {
    "womens-wellness": "womens",
    "mens-wellness": "all",
    "digestive-health": "digestion",
    "auto-immune-support": "all",
    "nervous-system": "calm",
    "energy-vitality": "energy",
    "joint-mobility": "all",
    "heart-health": "all",
    "liver-support": "cleanse",
    "kidney-support": "cleanse",
    "lung-support": "all",
    "hormone-balance": "womens",
    "sleep-relaxation": "calm",
    "full-body-detox": "cleanse"
  };

  const updateFilter = (selectedFilter) => {
    let visibleCount = 0;

    productCards.forEach((card) => {
      const concerns = (card.dataset.concern || "").split(/\s+/).filter(Boolean);
      const shouldShow = selectedFilter === "all" || concerns.includes(selectedFilter);
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    if (!status) return;
    const activeInput = filterInputs.find((input) => input.value === selectedFilter);
    const activeLabel = activeInput
      ? catalog.querySelector(`label[for="${activeInput.id}"]`)?.textContent.trim()
      : "all blends";

    status.textContent = selectedFilter === "all"
      ? `Showing all ${visibleCount} blends.`
      : `Showing ${visibleCount} ${activeLabel.toLowerCase()} ${visibleCount === 1 ? "blend" : "blends"}.`;
  };

  filterInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) updateFilter(input.value);
    });
  });

  productCards.forEach((card) => {
    const priceOutput = card.querySelector("[data-price-output]");
    const weightOutput = card.querySelector("[data-weight-output]");
    const weightInputs = Array.from(card.querySelectorAll('.weight-options input[type="radio"]'));

    weightInputs.forEach((input) => {
      input.addEventListener("change", () => {
        if (!input.checked) return;
        if (priceOutput) priceOutput.textContent = input.dataset.price || "";
        if (weightOutput) weightOutput.textContent = `${input.dataset.weight || "Selected"} loose blend`;
      });
    });
  });

  const productDetails = {
    "river-of-life": {
      name: "River of Life",
      kicker: "Circulation ritual",
      image: "assets/img/blend-river-of-life.webp",
      description: "A warming, grounding daily preparation designed for people building a more intentional vitality ritual.",
      plants: "Whole roots, bark, and aromatic botanicals",
      ritual: "Steep slowly; enjoy as a considered daytime cup",
      price: "From $34 · preview pricing"
    },
    "scales-of-balance": {
      name: "Scales of Balance",
      kicker: "Nervous-system ritual",
      image: "assets/img/blend-scales-of-balance.webp",
      description: "A calm-focused botanical blend for quieter evenings, slower transitions, and a daily moment with less noise.",
      plants: "Leafy herbs and aromatic whole botanicals",
      ritual: "Steep covered; build into an evening wind-down",
      price: "From $28.50 · preview pricing"
    },
    "sacred-sacral": {
      name: "Sacred Sacral",
      kicker: "Women’s wellness ritual",
      image: "assets/img/blend-sacred-sacral.webp",
      description: "A thoughtful plant ritual created around cyclical care, grounding, and time set aside to listen to the body.",
      plants: "Whole leaves, flowers, and gently aromatic herbs",
      ritual: "Prepare as a warm infusion and pause with intention",
      price: "From $28.50 · preview pricing"
    },
    "zapped-in": {
      name: "Zapped In",
      kicker: "Energy + focus ritual",
      image: "assets/img/blend-zapped-in.webp",
      description: "A bright daytime preparation for clear attention, deliberate momentum, and a cleaner-feeling start to the day.",
      plants: "Guayusa-led whole-leaf botanical blend",
      ritual: "Steep in the morning; adjust strength to your preference",
      price: "From $34 · preview pricing"
    },
    "bowel-balance": {
      name: "Bowel Balance",
      kicker: "Digestive ritual",
      image: "assets/img/blend-bowel-balance.webp",
      description: "A practical daily botanical preparation built for people who value steady, consistent digestive routines.",
      plants: "Cut leaves, seeds, and complementary herbs",
      ritual: "Prepare consistently and pair with a mindful meal rhythm",
      price: "From $28.50 · preview pricing"
    },
    "eliminate-regenerate": {
      name: "Eliminate + Regenerate",
      kicker: "Seasonal reset ritual",
      image: "assets/img/blend-eliminate-regenerate.webp",
      description: "A structured botanical ritual for a considered seasonal reset, supported by preparation guidance and education.",
      plants: "A four-part whole-botanical preparation",
      ritual: "Use only with the accompanying Kawsaypac preparation guide",
      price: "From $34 · preview pricing"
    },
    "final-flush": {
      name: "Final Flush",
      kicker: "Closing ritual",
      image: "assets/img/blend-final-flush.webp",
      description: "A concise closing preparation created to complete a guided plant program with care and a clear next step.",
      plants: "Whole herbs selected for the program’s final phase",
      ritual: "Follow the accompanying preparation guide",
      price: "From $28.50 · preview pricing"
    }
  };

  const dialog = document.querySelector("[data-product-dialog]");
  const dialogFields = dialog ? {
    image: dialog.querySelector("[data-dialog-image]"),
    kicker: dialog.querySelector("[data-dialog-kicker]"),
    title: dialog.querySelector("[data-dialog-title]"),
    description: dialog.querySelector("[data-dialog-description]"),
    plants: dialog.querySelector("[data-dialog-plants]"),
    ritual: dialog.querySelector("[data-dialog-ritual]"),
    price: dialog.querySelector("[data-dialog-price]"),
    interest: dialog.querySelector("[data-dialog-interest]")
  } : null;

  const openProduct = (slug, updateUrl = true) => {
    const product = productDetails[slug];
    if (!dialog || !dialogFields || !product) return false;
    dialogFields.image.src = product.image;
    dialogFields.image.alt = `${product.name} herbal blend`;
    dialogFields.kicker.textContent = product.kicker;
    dialogFields.title.textContent = product.name;
    dialogFields.description.textContent = product.description;
    dialogFields.plants.textContent = product.plants;
    dialogFields.ritual.textContent = product.ritual;
    dialogFields.price.textContent = product.price;
    dialogFields.interest.href = `mailto:hello@theelectriceats.com?subject=${encodeURIComponent(`Kawsaypac ${product.name} interest`)}`;
    if (updateUrl) history.replaceState(null, "", `#product-${slug}`);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("has-product-dialog");
    return true;
  };

  document.querySelectorAll("[data-product-open]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openProduct(link.dataset.productOpen);
    });
  });

  dialog?.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });
  dialog?.addEventListener("close", () => {
    document.body.classList.remove("has-product-dialog");
    if (location.hash.startsWith("#product-")) history.replaceState(null, "", `${location.pathname}${location.search}`);
  });

  const applyConcernHash = () => {
    const productSlug = location.hash.slice("#product-".length);
    if (location.hash.startsWith("#product-") && openProduct(productSlug, false)) return true;
    const filter = concernFilters[location.hash.slice(1)];
    if (!filter) return false;
    const input = filterInputs.find((item) => item.value === filter);
    if (input) input.checked = true;
    updateFilter(filter);
    return true;
  };

  const initialFilter = filterInputs.find((input) => input.checked)?.value || "all";
  if (!applyConcernHash()) updateFilter(initialFilter);
  window.addEventListener("hashchange", applyConcernHash);
})();
