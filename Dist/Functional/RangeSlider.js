/*!
 * Webflow Utilities v1.1.0
 * Range Slider Module
 * A customizable, attribute-driven range slider that can be easily integrated into any HTML-based website.
 * (c) 2023 Jorge Cortez
 * MIT License
 * https://github.com/JorchCortez/Weblfow-Trickery
 *
 * Self-contained: no separate shared script required (backward compatible with single-tag embeds).
 */

'use strict';

/** @private Core helpers (IIFE keeps globals clean if RangeSliderSimple.js is also on the page) */
var __WT_RANGE_SLIDER_CORE = (function () {
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
            Number(rawValue),
            Number(rightValueStr) - minDifference,
        );
    }

    function constrainRightValue(rawValue, leftValueStr, minDifference) {
        return Math.max(
            Number(rawValue),
            Number(leftValueStr) + minDifference,
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

/**
 * @file RangeSlider.js
 * @description A customizable dual-handle range slider for selecting value ranges.
 *
 * For native-only handles (no custom thumbs), see RangeSliderSimple.js.
 */

/**
 * @class RangeSlider
 * @param {HTMLElement} wrapper
 */
class RangeSlider {
    constructor(wrapper) {
        try {
            this.rs = __WT_RANGE_SLIDER_CORE;

            this.wrapper = wrapper;
            this.slider = wrapper.querySelector('[wt-rangeslider-element="slider"]');
            this.__suspendExternalSync = false;

            if (!this.slider) {
                throw new Error('Slider element not found within wrapper');
            }

            this.addStyles();
            this.initConfig();
            this.initElements();
            this.initState();
            this.setupEventListeners();
        } catch (err) {
            console.error(`RangeSlider initialization failed: ${err.message}`);
        }
    }

    addStyles() {
        const existing = document.getElementById('wt-rangeslider-styles');
        if (existing) return;

        const style = document.createElement('style');
        style.id = 'wt-rangeslider-styles';
        style.textContent = `
    [wt-rangeslider-element="slider"] {
        position: relative;
    }

    [wt-rangeslider-element="input-left"],
    [wt-rangeslider-element="input-right"] {
        pointer-events: all;
        position: absolute;
        height: 0;
        width: 100%;
        outline: none;
        -webkit-appearance: none;
        opacity: 0;
        top: 0;
        bottom: 0;
        margin: auto;
    }
    
    [wt-rangeslider-element="input-left"]::-webkit-slider-thumb,
    [wt-rangeslider-element="input-right"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: var(--thumb-width, 20px);
        height: var(--thumb-width, 20px);
        pointer-events: all;
        cursor: pointer;
    }
    
    [wt-rangeslider-element="input-left"]::-moz-range-thumb,
    [wt-rangeslider-element="input-right"]::-moz-range-thumb {
        width: var(--thumb-width, 20px);
        height: var(--thumb-width, 20px);
        pointer-events: all;
        cursor: pointer;
        opacity: 0;
    }

    [wt-rangeslider-element="thumb-left"],
    [wt-rangeslider-element="thumb-right"] {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        pointer-events: none;
        will-change: transform;
    }
    `;
        document.head.appendChild(style);
    }

    initConfig() {
        const cfg = this.rs.readSliderConfig(this.slider, 'wt-rangeslider');
        this.sliderMin = cfg.sliderMin;
        this.sliderMax = cfg.sliderMax;
        this.sliderSteps = cfg.sliderSteps;
        this.minDifference = cfg.minDifference;
        this.rightSuffix = cfg.rightSuffix;
        this.defaultSuffix = cfg.defaultSuffix;
        this.shouldFormatNumber = cfg.shouldFormatNumber;
    }

    initElements() {
        this.rangeStart = this.wrapper.querySelector(
            '[wt-rangeslider-range="from"]',
        );
        this.rangeEnd = this.wrapper.querySelector('[wt-rangeslider-range="to"]');

        this.displayStart = this.wrapper.querySelector(
            '[wt-rangeslider-display="from"]',
        );
        this.displayEnd = this.wrapper.querySelector(
            '[wt-rangeslider-display="to"]',
        );

        this.inputLeft = this.slider.querySelector(
            '[wt-rangeslider-element="input-left"]',
        );
        this.inputRight = this.slider.querySelector(
            '[wt-rangeslider-element="input-right"]',
        );
        this.thumbLeft = this.slider.querySelector(
            '[wt-rangeslider-element="thumb-left"]',
        );
        this.thumbRight = this.slider.querySelector(
            '[wt-rangeslider-element="thumb-right"]',
        );
        this.range = this.slider.querySelector('[wt-rangeslider-element="range"]');

        this.validateRequiredElements();
        this.setupThumbStyles();
    }

    setupThumbStyles() {
        const setupThumb = (thumb, input) => {
            const thumbWidth =
                thumb.offsetWidth ||
                parseInt(getComputedStyle(thumb).width, 10) ||
                20;
            input.style.setProperty('--thumb-width', `${thumbWidth}px`);

            thumb.style.position = 'absolute';
            thumb.style.pointerEvents = 'none';

            this.slider.style.setProperty('--thumb-offset', `${thumbWidth / 2}px`);
        };

        setupThumb(this.thumbLeft, this.inputLeft);
        setupThumb(this.thumbRight, this.inputRight);
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

        this.updateThumbPosition(
            this.inputLeft,
            this.thumbLeft,
            this.range,
            'left',
        );
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

        this.updateThumbPosition(
            this.inputRight,
            this.thumbRight,
            this.range,
            'right',
        );
    }

    setupEventListeners() {
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

    updateThumbPosition(input, thumb, range, side) {
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        const current = parseFloat(input.value);
        const percent = ((current - min) / (max - min)) * 100;

        if (side === 'left') {
            thumb.style.left = `${percent}%`;
            thumb.style.transform = 'translateX(-50%)';
            range.style.left = `${percent}%`;
        } else {
            thumb.style.right = `${100 - percent}%`;
            thumb.style.transform = 'translateX(50%)';
            range.style.right = `${100 - percent}%`;
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
            thumbLeft: this.thumbLeft,
            thumbRight: this.thumbRight,
            range: this.range,
        };

        Object.entries(requiredElements).forEach(([name, element]) => {
            if (!element) {
                throw new Error(`Required element ${name} is missing`);
            }
        });
    }
}

const initializeRangeSlider = () => {
    try {
        window.webtricks = window.webtricks || [];
        const wrappers = document.querySelectorAll(
            '[wt-rangeslider-element="slider-wrapper"]',
        );

        if (!wrappers || wrappers.length === 0) return;

        wrappers.forEach((wrapper) => {
            const instance = new RangeSlider(wrapper);
            window.webtricks.push({ RangeSlider: instance });
        });
    } catch (err) {
        console.error(`RangeSlider initialization error: ${err.message}`);
    }
};

if (/complete|interactive|loaded/.test(document.readyState)) {
    initializeRangeSlider();
} else {
    window.addEventListener('DOMContentLoaded', initializeRangeSlider);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RangeSlider, InitializeRangeSlider: initializeRangeSlider };
}
