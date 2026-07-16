(() => {
  const products = {
    "Cat's Claw": "cats-claw.webp",
    "River of Life": "river-of-life.webp",
    "Scales of Balance": "scales-of-balance.webp",
    "Sacred Sacral": "sacred-sacral.webp",
    "Zapped In": "zapped-in.webp",
    "Bowel Balance": "bowel-balance.webp",
    "Final Flush": "final-flush.webp",
    "Guayusa": "guayusa.webp",
    "Eliminate & Regenerate Kit": "eliminate-regenerate-kit.webp"
  };

  document.querySelectorAll(".product-item").forEach((card) => {
    const name = card.querySelector(".name-product")?.textContent.trim();
    const image = card.querySelector(".product-image-cart");
    const file = products[name];

    if (!image || !file) return;

    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    image.removeAttribute("data-wf-sku-bindings");
    image.src = `assets/product-transparent/${file}`;
    image.alt = `${name} herbal product`;
    image.decoding = "async";
    image.classList.add("kp-product-cutout");
  });
})();
