/*!
 * WebTricks — RangeSliderSimple
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
            this.initState();
            this.setupEventListeners();
        } catch (err) {
            console.error(`RangeSliderSimple initialization failed: ${err.message}`);
        }
    }

    addStyles() {
        const existing = document.getElementById('wt-rangeslidersimple-styles');
        if (existing) return;

        const style = document.createElement('style');
        style.id = 'wt-rangeslidersimple-styles';
        style.textContent = `
    [${ATTR_PREFIX}-element="slider"] {
        position: relative;
        min-height: 32px;
    }

    [${ATTR_PREFIX}-element="input-left"],
    [${ATTR_PREFIX}-element="input-right"] {
        position: absolute;
        left: 0;
        width: 100%;
        top: 0;
        bottom: 0;
        margin: auto;
        height: 24px;
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        pointer-events: auto;
        z-index: 2;
        outline: none;
    }

    [${ATTR_PREFIX}-element="input-right"] {
        z-index: 1;
    }

    [${ATTR_PREFIX}-element="input-left"]::-webkit-slider-thumb,
    [${ATTR_PREFIX}-element="input-right"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #222;
        cursor: pointer;
        pointer-events: auto;
    }

    [${ATTR_PREFIX}-element="input-left"]::-moz-range-thumb,
    [${ATTR_PREFIX}-element="input-right"]::-moz-range-thumb {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #222;
        cursor: pointer;
        border: none;
    }

    [${ATTR_PREFIX}-element="input-left"]::-webkit-slider-runnable-track,
    [${ATTR_PREFIX}-element="input-right"]::-webkit-slider-runnable-track {
        height: 6px;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.12);
    }

    [${ATTR_PREFIX}-element="input-left"]::-moz-range-track,
    [${ATTR_PREFIX}-element="input-right"]::-moz-range-track {
        height: 6px;
        border-radius: 3px;
        background: rgba(0, 0, 0, 0.12);
    }
    `;
        document.head.appendChild(style);
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
            this.inputLeft.style.zIndex = '3';
            this.inputRight.style.zIndex = '1';
        } else {
            this.inputRight.style.zIndex = '3';
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
