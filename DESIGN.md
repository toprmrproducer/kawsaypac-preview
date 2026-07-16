# Kawsaypac Shroomsy Direct: Design Contract

## 1. Direction

This build is a faithful content and brand adaptation of the supplied Shroomsy Webflow Home 1 export. The original DOM order, grid composition, section proportions, Webflow interaction IDs, hover states, looping rows, counters, nav behavior, and responsive breakpoints remain the structural source of truth. Kawsaypac imagery, language, navigation, and botanical motifs replace the mushroom theme.

## 2. Tokens

- Cream: `#faf9f6`
- Warm cream: `#f3f0e9`
- Forest: `#1f3a2a`
- Forest hover: `#2c4a37`
- Olive: `#958e59`
- Gold: `#c9a942`
- Gold tint: `#e5d9a8`
- Charcoal: `#2a2a26`
- White: `#ffffff`
- Display face: Instrument Serif, inherited from the template
- UI/body face: Lato / Inter Tight, inherited from the template
- Body minimum: 16px
- Minimum interactive target: 44px
- Radius grammar: template radii preserved, pills remain fully rounded

## 3. Layout Grammar

1. Full-viewport photographic hero with bottom-anchored editorial copy and an inset film card.
2. Animated number ledger.
3. Two-column editorial introduction leading into a 2x2 image and fact grid.
4. Full-width rounded CTA image band.
5. Product cards in the original Shroomsy commerce grid.
6. Dark moving feature wall with alternating imagery and copy.
7. Four benefit cards with repeated botanical character marks.
8. Dark event rail, preserving the template's card rhythm.
9. Infinite testimonial rows.
10. Journal cards followed by the original image-led footer and sticky closing scene.

## 4. Component Rules

- Navigation keeps Webflow's dropdown, drawer, cart, and search scaffolding. Destinations are Home, Shop, Retreats, Learn / Journal, Apothecary, and Our Story.
- The Kawsaypac primary logo replaces every Shroomsy wordmark.
- Repeated mushroom character marks become transparent herb sprigs, flowers, seed pods, tea cups, and hummingbirds.
- Product cards use real Kawsaypac pouch / herb imagery and retain the original price, hover, cart-overlay, and grid anatomy.
- Event cards become Ecuador retreat and education experiences while retaining the source card anatomy.
- All dark surfaces use forest, never black or purple.

## 5. Motion

- Retain all original `data-w-id` hooks and the official Webflow runtime from the supplied export.
- Preserve hero load sequence, counter rolls, parallax image classes, carousel and marquee loops, hover overlays, dropdown and mobile navigation behavior.
- Additional botanical floaters animate only with transform and opacity.
- Reduced motion disables custom floating and sway motion while leaving content visible.

## 6. Accessibility

- One H1.
- Every meaningful image receives Kawsaypac-specific alt text.
- Buttons and links keep visible text labels.
- Focus-visible rings use gold.
- Mobile navigation and source Webflow keyboard behavior remain intact.
- No content is hidden behind custom JS-only reveal states if the Webflow runtime fails.

## 7. Accepted First-Milestone Debt

- The first milestone is the homepage only.
- Ecommerce actions are visual until headless Shopify is connected.
- The Webflow CSS and interaction runtime remain CDN-hosted because preserving the exact supplied template behavior is a hard requirement.
