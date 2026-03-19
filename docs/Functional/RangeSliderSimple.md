# RangeSliderSimple

## Version

Current version: **1.0.0** (kept in sync with the `@version` banner in `Dist/Functional/RangeSliderSimple.js`).

## Description

`RangeSliderSimple` is a **dual-handle** range control built from two stacked `<input type="range">` elements. The script injects styling so both native thumbs stay visible and grabbable (shared rail on `::before`, transparent per-input tracks, thumb-only pointer events).

- **Rail:** solid **#111** by default (`wt-rangeslidersimple-trackbg` or `--wt-rs-track-bg` to change).
- **Between-handle accent:** optional **`wt-rangeslidersimple-rangehighlight="true"`**; fill color defaults to **#3b82f6** (`wt-rangeslidersimple-trackfill`).
- **Thumbs:** ~24px circles, white with border and shadow (tunable via CSS variables).

The script is **self-contained** (single file, one `<script>` tag).

## Functionality

- Two native range inputs with constrained values (left ≤ right, minimum gap configurable)
- Optional **from/to** text inputs and **from/to** display nodes kept in sync
- Optional **thousand separators** and **suffixes** on the end display
- **`pointerdown`** raises the active input in the stack when handles overlap so both thumbs stay draggable

## Installation

One script tag. Use [jsDelivr](https://www.jsdelivr.com/) (not raw GitHub URLs) so the MIME type is JavaScript.

```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@main/Dist/Functional/RangeSliderSimple.js"></script>
```

## Required attributes

- `wt-rangeslidersimple-element="slider-wrapper"` — outer container
- `wt-rangeslidersimple-element="slider"` — track container (holds both range inputs)
- `wt-rangeslidersimple-element="input-left"` — left `<input type="range">`
- `wt-rangeslidersimple-element="input-right"` — right `<input type="range">`

## Optional attributes (on the slider element)

### Value range and stepping

- `wt-rangeslidersimple-min` — minimum value (number; default **0**)
- `wt-rangeslidersimple-max` — maximum value (number; default **100**)
- `wt-rangeslidersimple-steps` — `step` on both range inputs (number; default **1**). Use any **positive** step the browser accepts for `<input type="range">` (integers or decimals, e.g. `0.1`). Invalid number strings cause initialization to throw.
- `wt-rangeslidersimple-mindifference` — minimum difference between the two values, in the same units as min/max (default: same as **steps**)

### Display and form text

- `wt-rangeslidersimple-formatnumber="true"` — format numeric displays with thousand separators (e.g. `1,000`)
- `wt-rangeslidersimple-rightsuffix` — appended to the **end** display when the end value is at **max** (e.g. `+` for “100+”)
- `wt-rangeslidersimple-defaultsuffix` — appended to the **end** display when `rightsuffix` does not apply (when the value is below max, or when `rightsuffix` is unset)

### Track appearance

- `wt-rangeslidersimple-trackbg` — full rail color (default **#111**)
- `wt-rangeslidersimple-rangehighlight="true"` — paint the segment **between** the two thumbs with the fill color; omit for a solid rail everywhere
- `wt-rangeslidersimple-trackfill` — that between-handle color when `rangehighlight` is enabled (default **#3b82f6**)

## Theming (CSS variables)

On `[wt-rangeslidersimple-element="slider"]` you can set:

- `--wt-rs-track-fill`, `--wt-rs-track-bg`
- `--wt-rs-thumb-bg`, `--wt-rs-thumb-border`, `--wt-rs-thumb-shadow`

Injected rules draw the shared rail on `::before`, keep native tracks transparent, and limit `pointer-events` to thumbs so stacked inputs do not block each other. When handles overlap, the last-pressed range input gets a higher `z-index`.

## Optional elements (inside the wrapper)

- `[wt-rangeslidersimple-range="from"]`, `[wt-rangeslidersimple-range="to"]` — typically `<input type="text">`; values stay in sync with the range inputs
- `[wt-rangeslidersimple-display="from"]`, `[wt-rangeslidersimple-display="to"]` — elements whose text content is updated to show the current range

## Example

```html
<div wt-rangeslidersimple-element="slider-wrapper">
  <div wt-rangeslidersimple-display="from">0</div>
  <div wt-rangeslidersimple-display="to">100</div>
  <input wt-rangeslidersimple-range="from" type="text" value="20" />
  <input wt-rangeslidersimple-range="to" type="text" value="80" />
  <div
    wt-rangeslidersimple-element="slider"
    wt-rangeslidersimple-min="0"
    wt-rangeslidersimple-max="100"
    wt-rangeslidersimple-steps="1"
  >
    <input type="range" wt-rangeslidersimple-element="input-left" />
    <input type="range" wt-rangeslidersimple-element="input-right" />
  </div>
</div>
```

## Coexisting with other embeds

You may load **multiple** WebTricks scripts on one page. Do **not** put `wt-rangeslider-*` and `wt-rangeslidersimple-*` attributes on the **same** component—they are different attribute families for different modules.

## CMSFilter

Filter-driven min/max for CMS collection ranges only applies to sliders that use the `wt-rangeslider-*` attribute set unless `CMSFilter` is extended to recognize `wt-rangeslidersimple-*`.

## Public API (instance)

After init, instances are pushed to `window.webtricks` as `{ RangeSliderSimple: instance }`.

- `setFrom(value)`, `setTo(value)`, `setRange(from, to)`, `reset()`

## CodePen / global CSS

The script injects **WebKit / Firefox** range pseudo-element rules so host resets (e.g. `input { appearance: none }`) do not leave broken thumbs. It re-appends its `<style id="wt-rangeslidersimple-styles">` so it wins in cascade order where possible. Avoid conflicting global `input[type=range]` rules; after CDN updates, hard-refresh or bump a cache-busting query on the script URL.
