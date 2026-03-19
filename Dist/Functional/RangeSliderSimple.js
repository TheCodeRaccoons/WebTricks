/*!
 * WebTricks — RangeSliderSimple
 * @version 0.0.10 — pre-release; bump patch (and docs/Functional/RangeSliderSimple.md) on every change to this file.
 * Dual native range inputs (no custom thumb DOM). Self-contained (single script tag).
 * MIT License
 */

'use strict';

/** @private Duplicated core logic (same behavior as RangeSlider) so this file has no shared dependency. */
var __WT_RANGE_SLIDER_SIMPLE_CORE = (function () {
    function validateNumber(value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
            throw new Error(`Invalid number value: ${value}`);
        }
        return num;
    }

    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function readSliderConfig(sliderEl, prefix) {
        const minAttr = sliderEl.getAttribute(`${prefix}-min`);
        const sliderMin = minAttr !== null ? validateNumber(minAttr) : 0;

        const maxAttr = sliderEl.getAttribute(`${prefix}-max`);
        const sliderMax = maxAttr !== null ? validateNumber(maxAttr) : 100;

        const stepsAttr = sliderEl.getAttribute(`${prefix}-steps`);
        const sliderSteps = stepsAttr !== null ? validateNumber(stepsAttr) : 1;

        const minDiffAttr = sliderEl.getAttribute(`${prefix}-mindifference`);
        const minDifference = minDiffAttr !== null ? validateNumber(minDiffAttr) : sliderSteps;

        return {
            sliderMin,
            sliderMax,
            sliderSteps,
            minDifference,
            rightSuffix: sliderEl.getAttribute(`${prefix}-rightsuffix`) || null,
            defaultSuffix: sliderEl.getAttribute(`${prefix}-defaultsuffix`) || null,
            shouldFormatNumber: sliderEl.getAttribute(`${prefix}-formatnumber`) || null,
        };
    }

    function constrainLeftValue(rawValue, rightValueStr, minDifference) {
        return Math.min(
            parseInt(rawValue, 10),
            parseInt(rightValueStr, 10) - minDifference,
        );
    }

    function constrainRightValue(rawValue, leftValueStr, minDifference) {
        return Math.max(
            parseInt(rawValue, 10),
            parseInt(leftValueStr, 10) + minDifference,
        );
    }

    function setNativeTextInputValue(input, constrainedValue, suspendBegin, suspendEnd) {
        if (!input) return;
        const valueProp = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        suspendBegin();
        valueProp.set.call(input, constrainedValue);
        suspendEnd();
    }

    function formatStartDisplayContent(constrainedValue, shouldFormatNumberAttr) {
        const displayLeft =
            shouldFormatNumberAttr === 'true'
                ? formatNumber(constrainedValue)
                : constrainedValue;
        return String(displayLeft);
    }

    function formatEndDisplayContent(
        constrainedValue,
        rawInputValue,
        sliderMax,
        shouldFormatNumberAttr,
        rightSuffix,
        defaultSuffix,
    ) {
        let finalDisplay =
            shouldFormatNumberAttr === 'true'
                ? formatNumber(constrainedValue)
                : constrainedValue;
        const rawNum = parseFloat(rawInputValue);
        if (rightSuffix && !isNaN(rawNum) && rawNum >= sliderMax) {
            return `${finalDisplay}${rightSuffix}`;
        }
        if (defaultSuffix) {
            return `${finalDisplay}${defaultSuffix}`;
        }
        return String(finalDisplay);
    }

    function hookInputValueSync(input, handler, isSuspended) {
        if (!input) return;
        const valueProp = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        try {
            Object.defineProperty(input, 'value', {
                get() {
                    return valueProp.get.call(this);
                },
                set(v) {
                    valueProp.set.call(this, v);
                    if (!isSuspended()) {
                        handler(v);
                    }
                },
                configurable: true,
                enumerable: true,
            });
        } catch (err) {
            // Fallback: rely on 'input'/'change' listeners if defineProperty fails
        }
    }

    function dispatchInputEvent(element) {
        if (element) {
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    return {
        readSliderConfig,
        constrainLeftValue,
        constrainRightValue,
        setNativeTextInputValue,
        formatStartDisplayContent,
        formatEndDisplayContent,
        hookInputValueSync,
        dispatchInputEvent,
    };
}());

const ATTR_PREFIX = 'wt-rangeslidersimple';

/**
 * Native dual-handle range slider; visible thumbs match browser hit targets.
 * @param {HTMLElement} wrapper
 */
class RangeSliderSimple {
    constructor(wrapper) {
        try {
            this.rs = __WT_RANGE_SLIDER_SIMPLE_CORE;

            this.wrapper = wrapper;
            this.slider = wrapper.querySelector(
                `[${ATTR_PREFIX}-element="slider"]`,
            );
            this.__suspendExternalSync = false;

            if (!this.slider) {
                throw new Error('Slider element not found within wrapper');
            }

            this.addStyles();
            this.initConfig();
            this.initElements();
            this.syncThemeVarsFromSliderToInputs();
            this.initState();
            this.setupEventListeners();
        } catch (err) {
            console.error(`RangeSliderSimple initialization failed: ${err.message}`);
        }
    }

    addStyles() {
        const existing = document.getElementById('wt-rangeslidersimple-styles');
        if (existing) existing.remove();

        const style = document.createElement('style');
        style.id = 'wt-rangeslidersimple-styles';
        /* Shared track on ::before. Default: solid rail (--wt-rs-track-bg). Optional rangehighlight paints fill between thumbs. */
        style.textContent = `
    [${ATTR_PREFIX}-element="slider"] {
        --wt-rs-track-fill: #3b82f6;
        --wt-rs-track-bg: #111;
        --wt-rs-thumb-bg: #ffffff;
        --wt-rs-thumb-border: #aeb6c2;
        --wt-rs-thumb-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.18);
        --wt-rs-range-from: 0%;
        --wt-rs-range-to: 100%;
        position: relative;
        isolation: isolate;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        align-items: center;
        justify-items: stretch;
        min-height: 2.75rem;
        box-sizing: border-box;
    }

    [${ATTR_PREFIX}-element="slider"]::before {
        content: "";
        grid-column: 1;
        grid-row: 1;
        align-self: center;
        width: 100%;
        height: 6px;
        border-radius: 3px;
        pointer-events: none;
        z-index: 0;
        box-sizing: border-box;
        background: var(--wt-rs-track-bg, #111);
    }

    [${ATTR_PREFIX}-element="slider"][${ATTR_PREFIX}-rangehighlight="true"]::before {
        background: linear-gradient(
            to right,
            var(--wt-rs-track-bg, #111) 0%,
            var(--wt-rs-track-bg, #111) var(--wt-rs-range-from, 0%),
            var(--wt-rs-track-fill, #3b82f6) var(--wt-rs-range-from, 0%),
            var(--wt-rs-track-fill, #3b82f6) var(--wt-rs-range-to, 100%),
            var(--wt-rs-track-bg, #111) var(--wt-rs-range-to, 100%),
            var(--wt-rs-track-bg, #111) 100%
        );
    }

    input[type="range"][${ATTR_PREFIX}-element="input-left"],
    input[type="range"][${ATTR_PREFIX}-element="input-right"] {
        --wt-rs-track-fill: #3b82f6;
        --wt-rs-track-bg: #111;
        --wt-rs-thumb-bg: #ffffff;
        --wt-rs-thumb-border: #aeb6c2;
        --wt-rs-thumb-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.18);
        grid-column: 1;
        grid-row: 1;
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        pointer-events: none;
        accent-color: transparent;
        z-index: 2;
        height: 1.75rem;
        min-height: 1.75rem;
        background: transparent;
        -webkit-appearance: none !important;
        appearance: none !important;
        -moz-appearance: none !important;
    }

    input[type="range"][${ATTR_PREFIX}-element="input-left"]::-webkit-slider-runnable-track,
    input[type="range"][${ATTR_PREFIX}-element="input-right"]::-webkit-slider-runnable-track {
        pointer-events: none;
        height: 6px;
        border-radius: 3px;
        background: transparent;
        border: none;
    }

    input[type="range"][${ATTR_PREFIX}-element="input-left"]::-webkit-slider-thumb,
    input[type="range"][${ATTR_PREFIX}-element="input-right"]::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        pointer-events: auto;
        position: relative;
        z-index: 1;
        width: 24px;
        height: 24px;
        margin-top: -9px;
        border-radius: 50%;
        background: var(--wt-rs-thumb-bg, #ffffff) !important;
        border: 1px solid var(--wt-rs-thumb-border, #aeb6c2) !important;
        box-shadow: var(--wt-rs-thumb-shadow, 0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.18)) !important;
        cursor: pointer;
    }

    input[type="range"][${ATTR_PREFIX}-element="input-left"]::-moz-range-track,
    input[type="range"][${ATTR_PREFIX}-element="input-right"]::-moz-range-track {
        pointer-events: none;
        height: 6px;
        border-radius: 3px;
        background: transparent;
        border: none;
    }

    input[type="range"][${ATTR_PREFIX}-element="input-left"]::-moz-range-progress,
    input[type="range"][${ATTR_PREFIX}-element="input-right"]::-moz-range-progress {
        pointer-events: none;
        height: 6px;
        border-radius: 3px;
        background: transparent;
        border: none;
    }

    input[type="range"][${ATTR_PREFIX}-element="input-left"]::-moz-range-thumb,
    input[type="range"][${ATTR_PREFIX}-element="input-right"]::-moz-range-thumb {
        pointer-events: auto;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--wt-rs-thumb-bg, #ffffff) !important;
        border: 1px solid var(--wt-rs-thumb-border, #aeb6c2) !important;
        box-shadow: var(--wt-rs-thumb-shadow, 0 0 0 1px rgba(0, 0, 0, 0.04), 0 1px 4px rgba(0, 0, 0, 0.18)) !important;
        cursor: pointer;
    }

    input[type="range"][${ATTR_PREFIX}-element="input-left"]:focus-visible,
    input[type="range"][${ATTR_PREFIX}-element="input-right"]:focus-visible {
        outline: 2px solid var(--wt-rs-track-fill, #3b82f6);
        outline-offset: 2px;
    }
    `;
        document.head.appendChild(style);
    }

    syncTrackFillPercents() {
        if (!this.slider || !this.inputLeft || !this.inputRight) return;
        const min = parseInt(this.inputLeft.min, 10);
        const max = parseInt(this.inputLeft.max, 10);
        const safeMin = Number.isFinite(min) ? min : 0;
        const safeMax = Number.isFinite(max) ? max : 100;
        const span = safeMax <= safeMin ? 1 : safeMax - safeMin;
        const leftVal = parseInt(this.inputLeft.value, 10);
        const rightVal = parseInt(this.inputRight.value, 10);
        const safeL = Number.isFinite(leftVal) ? leftVal : safeMin;
        const safeR = Number.isFinite(rightVal) ? rightVal : safeMax;
        const pctFrom = ((safeL - safeMin) / span) * 100;
        const pctTo = ((safeR - safeMin) / span) * 100;
        this.slider.style.setProperty('--wt-rs-range-from', `${pctFrom}%`);
        this.slider.style.setProperty('--wt-rs-range-to', `${pctTo}%`);
    }

    /** WebKit range pseudos resolve theme vars on the input; copy from slider after config. */
    syncThemeVarsFromSliderToInputs() {
        if (!this.slider || !this.inputLeft || !this.inputRight) return;
        const names = [
            '--wt-rs-track-fill',
            '--wt-rs-track-bg',
            '--wt-rs-thumb-bg',
            '--wt-rs-thumb-border',
            '--wt-rs-thumb-shadow',
        ];
        const cs = getComputedStyle(this.slider);
        names.forEach((name) => {
            const val = cs.getPropertyValue(name);
            if (val && val.trim()) {
                const v = val.trim();
                this.inputLeft.style.setProperty(name, v);
                this.inputRight.style.setProperty(name, v);
            }
        });
    }

    initConfig() {
        const cfg = this.rs.readSliderConfig(this.slider, ATTR_PREFIX);
        this.sliderMin = cfg.sliderMin;
        this.sliderMax = cfg.sliderMax;
        this.sliderSteps = cfg.sliderSteps;
        this.minDifference = cfg.minDifference;
        this.rightSuffix = cfg.rightSuffix;
        this.defaultSuffix = cfg.defaultSuffix;
        this.shouldFormatNumber = cfg.shouldFormatNumber;

        const trackFill = this.slider.getAttribute(`${ATTR_PREFIX}-trackfill`);
        if (trackFill) {
            this.slider.style.setProperty('--wt-rs-track-fill', trackFill);
        }
        const trackBg = this.slider.getAttribute(`${ATTR_PREFIX}-trackbg`);
        if (trackBg) {
            this.slider.style.setProperty('--wt-rs-track-bg', trackBg);
        }
    }

    initElements() {
        this.rangeStart = this.wrapper.querySelector(
            `[${ATTR_PREFIX}-range="from"]`,
        );
        this.rangeEnd = this.wrapper.querySelector(`[${ATTR_PREFIX}-range="to"]`);

        this.displayStart = this.wrapper.querySelector(
            `[${ATTR_PREFIX}-display="from"]`,
        );
        this.displayEnd = this.wrapper.querySelector(
            `[${ATTR_PREFIX}-display="to"]`,
        );

        this.inputLeft = this.slider.querySelector(
            `[${ATTR_PREFIX}-element="input-left"]`,
        );
        this.inputRight = this.slider.querySelector(
            `[${ATTR_PREFIX}-element="input-right"]`,
        );

        this.validateRequiredElements();
    }

    initState() {
        [this.inputLeft, this.inputRight].forEach((input) => {
            input.setAttribute('min', this.sliderMin);
            input.setAttribute('max', this.sliderMax);
            input.setAttribute('step', this.sliderSteps);
            input.setAttribute('formnovalidate', '');
            input.setAttribute('data-form-ignore', '');
        });

        if (this.rangeStart && this.rangeStart.value) {
            this.updateLeftValues(this.rangeStart.value);
        } else {
            this.updateLeftValues(this.sliderMin);
        }

        if (this.rangeEnd && this.rangeEnd.value) {
            this.updateRightValues(this.rangeEnd.value);
        } else {
            this.updateRightValues(this.sliderMax);
        }
    }

    bringInputToFront(which) {
        if (which === 'left') {
            this.inputLeft.style.zIndex = '10';
            this.inputRight.style.zIndex = '2';
        } else {
            this.inputRight.style.zIndex = '10';
            this.inputLeft.style.zIndex = '2';
        }
    }

    updateLeftValues(value) {
        const constrainedValue = this.rs.constrainLeftValue(
            value,
            this.inputRight.value,
            this.minDifference,
        );

        this.inputLeft.value = constrainedValue;

        if (this.rangeStart) {
            this.rs.setNativeTextInputValue(
                this.rangeStart,
                constrainedValue,
                () => {
                    this.__suspendExternalSync = true;
                },
                () => {
                    this.__suspendExternalSync = false;
                },
            );
        }

        if (this.displayStart) {
            this.displayStart.textContent = this.rs.formatStartDisplayContent(
                constrainedValue,
                this.shouldFormatNumber,
            );
        }

        this.syncTrackFillPercents();
    }

    updateRightValues(value) {
        const constrainedValue = this.rs.constrainRightValue(
            value,
            this.inputLeft.value,
            this.minDifference,
        );

        this.inputRight.value = constrainedValue;

        if (this.rangeEnd) {
            this.rs.setNativeTextInputValue(
                this.rangeEnd,
                constrainedValue,
                () => {
                    this.__suspendExternalSync = true;
                },
                () => {
                    this.__suspendExternalSync = false;
                },
            );
        }

        if (this.displayEnd) {
            this.displayEnd.textContent = this.rs.formatEndDisplayContent(
                constrainedValue,
                value,
                this.sliderMax,
                this.shouldFormatNumber,
                this.rightSuffix,
                this.defaultSuffix,
            );
        }

        this.syncTrackFillPercents();
    }

    setupEventListeners() {
        const onLeftPointer = () => this.bringInputToFront('left');
        const onRightPointer = () => this.bringInputToFront('right');

        this.inputLeft.addEventListener('pointerdown', onLeftPointer);
        this.inputRight.addEventListener('pointerdown', onRightPointer);

        this.inputLeft.addEventListener('input', () => {
            this.updateLeftValues(this.inputLeft.value);
            if (this.rangeStart) {
                this.rs.dispatchInputEvent(this.rangeStart);
            }
        });

        this.inputRight.addEventListener('input', () => {
            this.updateRightValues(this.inputRight.value);
            if (this.rangeEnd) {
                this.rs.dispatchInputEvent(this.rangeEnd);
            }
        });

        if (this.rangeStart) {
            this.rangeStart.addEventListener('input', (e) => {
                this.updateLeftValues(e.target.value);
            });
            this.rangeStart.addEventListener('change', (e) => {
                this.updateLeftValues(e.target.value);
            });
            this.rs.hookInputValueSync(
                this.rangeStart,
                (val) => {
                    this.updateLeftValues(val);
                },
                () => this.__suspendExternalSync,
            );
        }

        if (this.rangeEnd) {
            this.rangeEnd.addEventListener('input', (e) => {
                this.updateRightValues(e.target.value);
            });
            this.rangeEnd.addEventListener('change', (e) => {
                this.updateRightValues(e.target.value);
            });
            this.rs.hookInputValueSync(
                this.rangeEnd,
                (val) => {
                    this.updateRightValues(val);
                },
                () => this.__suspendExternalSync,
            );
        }
    }

    setFrom(value) {
        this.updateLeftValues(value);
    }

    setTo(value) {
        this.updateRightValues(value);
    }

    setRange(from, to) {
        this.updateLeftValues(from);
        this.updateRightValues(to);
    }

    reset() {
        this.setRange(this.sliderMin, this.sliderMax);
    }

    validateRequiredElements() {
        const requiredElements = {
            inputLeft: this.inputLeft,
            inputRight: this.inputRight,
        };

        Object.entries(requiredElements).forEach(([name, element]) => {
            if (!element) {
                throw new Error(`Required element ${name} is missing`);
            }
        });
    }
}

const initializeRangeSliderSimple = () => {
    try {
        window.webtricks = window.webtricks || [];
        const wrappers = document.querySelectorAll(
            `[${ATTR_PREFIX}-element="slider-wrapper"]`,
        );

        if (!wrappers || wrappers.length === 0) return;

        wrappers.forEach((wrapper) => {
            const instance = new RangeSliderSimple(wrapper);
            window.webtricks.push({ RangeSliderSimple: instance });
        });

        const bumpStyleOrder = () => {
            const injectedStyle = document.getElementById('wt-rangeslidersimple-styles');
            if (injectedStyle && document.head) {
                document.head.appendChild(injectedStyle);
            }
        };
        bumpStyleOrder();
        setTimeout(bumpStyleOrder, 0);
    } catch (err) {
        console.error(`RangeSliderSimple initialization error: ${err.message}`);
    }
};

if (/complete|interactive|loaded/.test(document.readyState)) {
    initializeRangeSliderSimple();
} else {
    window.addEventListener('DOMContentLoaded', initializeRangeSliderSimple);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        RangeSliderSimple,
        InitializeRangeSliderSimple: initializeRangeSliderSimple,
    };
}
