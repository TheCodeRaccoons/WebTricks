# RangeSliderSimple

## Version

Current version: **0.0.6** (pre-release — see banner in `Dist/Functional/RangeSliderSimple.js`; bump patch and this line when the script changes).

## Description

`RangeSliderSimple` is a dual-handle range control built from two `<input type="range">` elements. Styling follows the **default MDN / Chrome** pattern (blue filled track, grey remainder, white pill thumb); default fill **#3b82f6** matches typical `RangeSlider` `[range]` bar examples. Hit targets match the painted thumbs. The file is **self-contained** (same core behavior as `RangeSlider`, inlined—keep edits in sync manually if you change constraint/display logic).

Use **`RangeSlider`** when you need custom thumb graphics or a separate range bar element. Use **`RangeSliderSimple`** when native appearance (plus your own CSS overrides) is enough.

## Functionality

- Dual native range inputs
- Same optional form/display wiring pattern as `RangeSlider` (with `wt-rangeslidersimple-*` names)
- Configurable min, max, step, minimum gap between handles
- Optional number formatting and display suffixes
- `pointerdown` raises the active track so overlapping handles remain grabbable

## Installation

One script tag. Use [jsDelivr](https://www.jsdelivr.com/) (not raw GitHub URLs) so the MIME type is JavaScript.

```html
<script src="https://cdn.jsdelivr.net/gh/TheCodeRaccoons/WebTricks@main/Dist/Functional/RangeSliderSimple.js"></script>
```

## Required attributes

- `wt-rangeslidersimple-element="slider-wrapper"` — outer container
- `wt-rangeslidersimple-element="slider"` — track container (holds both inputs)
- `wt-rangeslidersimple-element="input-left"` — left `<input type="range">`
- `wt-rangeslidersimple-element="input-right"` — right `<input type="range">`

## Optional attributes (on the slider element)

Same semantics as `RangeSlider`, with the `wt-rangeslidersimple-` prefix:

- `wt-rangeslidersimple-min`, `wt-rangeslidersimple-max`, `wt-rangeslidersimple-steps`
- `wt-rangeslidersimple-mindifference`
- `wt-rangeslidersimple-formatnumber`, `wt-rangeslidersimple-rightsuffix`, `wt-rangeslidersimple-defaultsuffix`
- `wt-rangeslidersimple-trackfill` — optional CSS color for the filled portion of the track (default **#3b82f6**, aligned with common `RangeSlider` `[range]` bar examples)
- `wt-rangeslidersimple-trackbg` — optional unfilled track color (default **#e5e7eb**)

## Theming (CSS variables)

On `[wt-rangeslidersimple-element="slider"]` you can override:

- `--wt-rs-track-fill`, `--wt-rs-track-bg`
- `--wt-rs-thumb-bg`, `--wt-rs-thumb-border`, `--wt-rs-thumb-shadow`

Injected styling approximates the default **MDN / Chrome** range look (white vertical pill thumb, blue progress, grey track).

## Optional elements (inside wrapper)

- `[wt-rangeslidersimple-range="from"]`, `[wt-rangeslidersimple-range="to"]` — text inputs
- `[wt-rangeslidersimple-display="from"]`, `[wt-rangeslidersimple-display="to"]` — display nodes

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

## Using both slider types on one page

You may load **`RangeSlider.js`** and **`RangeSliderSimple.js`** on the same page. Do **not** mix attribute families on the same component (`wt-rangeslider-*` vs `wt-rangeslidersimple-*`).

## CMSFilter

Filter-driven min/max for collection ranges applies to **`wt-rangeslider-*`** only unless `CMSFilter` is extended for `wt-rangeslidersimple-*`.

## Public API (instance)

After init, instances are available on `window.webtricks` as `{ RangeSliderSimple: instance }`.

- `setFrom(value)`, `setTo(value)`, `setRange(from, to)`, `reset()`

## CodePen / global CSS

The script injects complete **WebKit / Firefox** range pseudo-element styling so host resets (e.g. CodePen `input { appearance: none }`) do not leave unstyled thumbs. It also moves the injected `<style>` to the end of `<head>` (and on `setTimeout(0)`). Avoid duplicating conflicting `input[type=range]` rules in the Pen’s CSS panel; purge jsDelivr or pin a commit after updates.
