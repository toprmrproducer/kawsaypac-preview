# Kawsaypac Production Design Contract

## 1. Direction

Kawsaypac is a luminous, landscape-led Ecuadorian herbal brand. The visual system combines a cinematic Andean entry with a calm apothecary editorial body. The experience must feel sacred, grounded, expensive, honest, and easy to use for customers who are not highly technical.

## 2. Tokens

- Cream: `#FAF9F6`
- Forest: `#1F3A2A`
- Forest 2: `#2C4A37`
- Gold: `#C9A942`
- Olive: `#958E59`
- Charcoal: `#2A2A26`
- Paper: `#F3F0E9`
- Display type: Playfair Display, weights 400 to 700, with italic accents
- Body type: Satoshi Variable, weights 400 to 700
- Content width: 1240px
- Corner grammar: 18px cards, 28px media, fully rounded controls
- Interactive target: 44px minimum

## 3. Layout

The homepage begins inside a full-viewport pinned Cotopaxi scene with no blank title screen. The short camera journey moves continuously from a close summit, through a lush Andean valley with native vegetation and wildflowers, into a sunlit Amazon canopy. Cotopaxi remains the visual anchor through the middle reveal so transitions never feel like unrelated locations. Wildlife is incidental and tiny: one distant condor and one hummingbird only. Nature remains the hero.

Below the hero, the locked order is: Our Collections, Philosophy, Best Sellers, Shop by Concern, Retreats, Community Stories, Newsletter, Footer. The body uses generous warm-white space, subtle tonal transitions, circular bowl imagery, and calm editorial grids. Landscape imagery appears only as a contained accent in Retreats and the footer. Secondary pages use a compact image-led hero and a readable 760px article measure.

## 4. Primitives and states

- Liquid nav: bright frosted pill, refractive SVG layer, solid white tint, inset shine, and shadow. Desktop dropdowns support pointer and keyboard. Mobile opens a full sheet.
- Button: forest primary and bordered cream secondary. Every button has default, hover, active, focus, and disabled treatment.
- Collection bowl: circular ceramic-bowl image, direct label, clear destination, and no decorative edge treatment.
- Concern bowl: larger bowl-led card with a short educational description and obvious 44px-plus link target.
- Product card: cream surface with 18px radius, restrained border, square image crop, real price, direct Shopify destination, and small vertical hover lift.
- Community film card: click-to-play facade with an explicit production-status badge until approved customer footage exists. Concept portraits are never represented as verified customers.
- Form: high-contrast label, 52px field, visible focus ring, inline error copy, and a real Shopify customer-form destination. Never simulate a successful subscription.
- Modal: focus-contained, Escape-close, labeled close button, and clear placeholder disclosure when footage is pending.

## 5. Motion

The hero is the single large motion moment. One GSAP ScrollTrigger timeline pins the viewport for a short descent and scrubs three photorealistic scene plates: summit (0–33%), green valley (33–68%), and Amazon (68–100%). Transitions use cross-dissolve, upward drift, mist, and a continuous pullback; there are no hard cuts, spins, sideways travel, dark overlays, or flicker-prone layout animation. Headline copy begins left of the summit and may be partially occluded by the mountain. All other reveals move only upward by 16px while fading. Cards may use a restrained hover lift and image scale. No horizontal entrances, scroll hijacking, body-edge flowers, or draggable body ornaments are permitted. Motion uses transform, opacity, and filter only. Reduced-motion and mobile receive a complete static summit hero with readable copy.

## 6. Responsive behavior

- Desktop: pinned hero and full pill navigation.
- Tablet: two-column content grids and mobile navigation sheet.
- Mobile at 390px: static composed hero, visible product copy, hidden brand statement, single-column cards, no horizontal overflow, and at least 44px targets.

## 7. Accessibility and accepted integration debt

Semantic headings, visible focus rings, descriptive image text, keyboard menus, focus-contained modals, and reduced-motion support are required. Product claims remain educational and include the FDA disclaimer. Product links use the live Shopify storefront when a verified URL is known. No fabricated customer quote, identity, metric, certification, or outcome may be shipped. Cart and checkout remain Shopify integration boundaries. The preview may acknowledge an item selection but must not present a fake checkout.
