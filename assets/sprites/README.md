# Kawsaypac sprite system

This folder contains eight transparent herb illustrations and two matching hummingbird poses. `sprite-system.css` provides botanical sway utilities; `sprite-system.js` creates one decorative hummingbird that travels only between visible elements marked `data-perch`.

## 1. Load the system

Add these two tags to a page. The script path is relative to the HTML file.

```html
<link rel="stylesheet" href="./sprite-system.css">
<script
  src="./sprite-system.js"
  data-sprite-root="./assets/sprites"
  defer
></script>
```

## 2. Place a transparent herb

Use WebP first and keep PNG as the fallback. Decorative sprites have an empty alt and are ignored by assistive technology.

```html
<picture
  class="kp-herb-floater kp-herb-floater--bottom-right kp-herb-floater--quiet"
  aria-hidden="true"
  style="--kp-herb-size: clamp(5rem, 10vw, 10rem); --kp-herb-edge-x: 2rem;"
>
  <source
    srcset="./assets/sprites/herb-icons/passionflower-vine.webp"
    type="image/webp"
  >
  <img
    src="./assets/sprites/herb-icons/passionflower-vine.png"
    alt=""
    width="1254"
    height="1254"
    loading="lazy"
    decoding="async"
  >
</picture>
```

Available modifiers:

- Size: `kp-herb-floater--small`, `--large`
- Position: `--top-left`, `--top-right`, `--bottom-left`, `--bottom-right`, `--inline`
- Motion: `--quiet`, `--reverse`, `--drift`
- Responsive: `--desktop-only`

The older `flora-sprite`, `flora-sprite--small`, and `flora-sprite--reverse` image classes remain supported.

## 3. Give the hummingbird places to rest

Mark existing sections, cards, or ornaments. The script uses their visible rectangles as coordinates; it does not add scrolling, capture input, or change page layout.

```html
<section
  class="hero"
  data-perch
  data-perch-x="82"
  data-perch-y="24"
  data-perch-offset-x="-18"
  data-perch-offset-y="8"
  data-perch-pause="6200"
>
  <!-- existing section content -->
</section>

<article
  class="journal-card"
  data-perch
  data-perch-x="12"
  data-perch-y="18"
  data-perch-pause="7400"
>
  <!-- existing card content -->
</article>
```

Perch attributes:

| Attribute | Meaning | Default |
| --- | --- | --- |
| `data-perch-x` | Horizontal point inside the element, 0–100% | `50` |
| `data-perch-y` | Vertical point inside the element, 0–100% | `35` |
| `data-perch-offset-x` | Pixel nudge after percentage placement | `0` |
| `data-perch-offset-y` | Pixel nudge after percentage placement | `0` |
| `data-perch-min-top` | Minimum fixed top coordinate, useful below sticky nav | `82` |
| `data-perch-pause` | Rest time in milliseconds, clamped to 3500–12000 | randomized 5400–7600 |

Use at least two perches in the same viewport for visible flight. With one visible perch, the bird rests quietly. It is hidden below 768px, hidden when reduced motion is requested, pauses in background tabs, has no pointer events, and never manipulates scroll position.

For DOM-injected content, run:

```js
window.KawsaypacSprites.refresh();
```

Temporary controls are also available:

```js
window.KawsaypacSprites.pause();
window.KawsaypacSprites.resume();
```

Set `data-hummingbird="off"` on the `<html>` or `<body>` element to disable it for an individual page.

## Asset inventory

See `manifest.json` for dimensions and paths. The QA contact sheet is `herb-icons/herb-icons-contact-sheet.png`. Every production PNG and WebP sprite in `herb-icons/` and `hummingbirds/` has an alpha channel.
