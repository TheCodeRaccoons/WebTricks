/*!
 * Webflow Utilities v1.1.0
 * Range Slider Module
 * A customizable, attribute-driven range slider that can be easily integrated into any HTML-based website.
 * (c) 2023 Jorge Cortez
 * MIT License
 * https://github.com/JorchCortez/Weblfow-Trickery
 */

/**
 * @file RangeSlider.js
 * @description A customizable dual-handle range slider for selecting value ranges.
 * 
 * Key Features:
 * - Dual handles for selecting a range of values
 * - Real-time visual updates
 * - Form integration with input fields
 * - Display elements for current values
 * - Customizable thumbs with SVG/image support
 * - Mutation observer support for programmatic value changes
 * - Configurable min/max values and step size
 * 
 * Required Attributes:
 * - wt-rangeslider-element="slider-wrapper": Container element
 * - wt-rangeslider-element="slider": Main slider element
 * - wt-rangeslider-element="input-left": Left range input
 * - wt-rangeslider-element="input-right": Right range input
 * - wt-rangeslider-element="thumb-left": Left thumb element
 * - wt-rangeslider-element="thumb-right": Right thumb element
 * - wt-rangeslider-element="range": Range indicator element
 * 
 * Optional Attributes:
 * - wt-rangeslider-min: Minimum value (default: 0)
 * - wt-rangeslider-max: Maximum value (default: 100)
 * - wt-rangeslider-steps: Step size (default: 1)
 * 
 * Optional Elements:
 * - [wt-rangeslider-range="from"]: Form input for start value
 * - [wt-rangeslider-range="to"]: Form input for end value
 * - [wt-rangeslider-display="from"]: Display element for start value
 * - [wt-rangeslider-display="to"]: Display element for end value
 * 
 * @example
 * <!-- Basic Implementation -->
 * <div wt-rangeslider-element="slider-wrapper">
 *   <!-- Optional Display Elements -->
 *   <div wt-rangeslider-display="from">0</div>
 *   <div wt-rangeslider-display="to">100</div>
 *   
 *   <!-- Optional Form Inputs -->
 *   <input wt-rangeslider-range="from" type="text">
 *   <input wt-rangeslider-range="to" type="text">
 *   
 *   <!-- Required Slider Structure -->
 *   <div wt-rangeslider-element="slider"
 *        wt-rangeslider-min="0"
 *        wt-rangeslider-max="100"
 *        wt-rangeslider-steps="1">
 *     <div wt-rangeslider-element="range"></div>
 *     <div wt-rangeslider-element="thumb-left"></div>
 *     <div wt-rangeslider-element="thumb-right"></div>
 *     <input type="range" wt-rangeslider-element="input-left">
 *     <input type="range" wt-rangeslider-element="input-right">
 *   </div>
 * </div>
 * 
 * @example
 * <!-- Custom Thumb Implementation -->
 * <div wt-rangeslider-element="slider-wrapper">
 *   <div wt-rangeslider-element="slider">
 *     <div wt-rangeslider-element="range"></div>
 *     <div wt-rangeslider-element="thumb-left">
 *       <svg width="20" height="20">
 *         <circle cx="10" cy="10" r="8" fill="white" stroke="black"/>
 *       </svg>
 *     </div>
 *     <div wt-rangeslider-element="thumb-right">
 *       <svg width="20" height="20">
 *         <circle cx="10" cy="10" r="8" fill="white" stroke="black"/>
 *       </svg>
 *     </div>
 *     <input type="range" wt-rangeslider-element="input-left">
 *     <input type="range" wt-rangeslider-element="input-right">
 *   </div>
 * </div>
 * 
 * Behavior:
 * 1. Slider updates in real-time during interaction
 * 2. Form inputs update simultaneously with slider movement
 * 3. Display elements update in real-time
 * 4. Programmatic changes to form inputs trigger slider updates
 * 5. Values are constrained within min/max range
 * 6. Left value cannot exceed right value minus step size
 * 7. Right value cannot be less than left value plus step size
 */

/**
 * @class RangeSlider
 * @classdesc Creates a range slider component with two handles for selecting a range of values.
 * The component supports both visual slider interaction and direct input of values.
 *
 * @param {HTMLElement} wrapper - The container element for the range slider
 * @throws {Error} If required elements or attributes are missing
 */
class RangeSlider {
/**
 * @constructor
 * @param {HTMLElement} wrapper - The wrapper element containing all slider components
 */
constructor(wrapper) {
    try {
    this.wrapper = wrapper;
    this.slider = wrapper.querySelector('[wt-rangeslider-element="slider"]');
    // Guard flag to avoid recursive updates when syncing external inputs
    this.__suspendExternalSync = false;

    if (!this.slider) {
        throw new Error('Slider element not found within wrapper');
    }

    // Add required styles
    this.addStyles();

    // Initialize configuration
    this.initConfig();

    // Initialize elements
    this.initElements();

    // Setup initial state
    this.initState();

    // Setup event listeners
    this.setupEventListeners();
    } catch (err) {
    console.error(`RangeSlider initialization failed: ${err.message}`);
    }
}

/**
 * Adds required styles for proper thumb alignment
 * @private
 */
addStyles() {
    // Inject styles once per document
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

/**
 * Initialize slider configuration from attributes
 * @private
 */
initConfig() {
    const minAttr = this.slider.getAttribute('wt-rangeslider-min');
    this.sliderMin = minAttr !== null ? this.validateNumber(minAttr) : 0;
    
    const maxAttr = this.slider.getAttribute('wt-rangeslider-max');
    this.sliderMax = maxAttr !== null ? this.validateNumber(maxAttr) : 100;
    
    const stepsAttr = this.slider.getAttribute('wt-rangeslider-steps');
    this.sliderSteps = stepsAttr !== null ? this.validateNumber(stepsAttr) : 1;
    
    // Minimum difference between left and right values
    const minDiffAttr = this.slider.getAttribute('wt-rangeslider-mindifference');
    this.minDifference = minDiffAttr !== null ? this.validateNumber(minDiffAttr) : this.sliderSteps;

    // Show preffix
    this.rightSuffix =
    this.slider.getAttribute('wt-rangeslider-rightsuffix') || null;
    // Show preffix
    this.defaultSuffix =
    this.slider.getAttribute('wt-rangeslider-defaultsuffix') || null;
    // Show preffix
    this.shouldFormatNumber =
    this.slider.getAttribute('wt-rangeslider-formatnumber') || null;
}

/**
 * Initialize DOM elements
 * @private
 */
initElements() {
    // Range inputs (form elements)
    this.rangeStart = this.wrapper.querySelector(
    '[wt-rangeslider-range="from"]',
    );
    this.rangeEnd = this.wrapper.querySelector('[wt-rangeslider-range="to"]');

    // Display elements
    this.displayStart = this.wrapper.querySelector(
    '[wt-rangeslider-display="from"]',
    );
    this.displayEnd = this.wrapper.querySelector(
    '[wt-rangeslider-display="to"]',
    );

    // Slider elements
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

/**
 * Sets up proper thumb styling to ensure clickable areas align with visuals
 * @private
 */
setupThumbStyles() {
    const setupThumb = (thumb, input) => {
    // Ensure the input's thumb aligns with our custom thumb
    const thumbWidth = thumb.offsetWidth || parseInt(getComputedStyle(thumb).width) || 20;
    input.style.setProperty('--thumb-width', `${thumbWidth}px`);
    
    // Apply styles to ensure proper positioning and hit areas
    thumb.style.position = 'absolute';
    thumb.style.pointerEvents = 'none';
    
    // Create a custom property for the thumb offset
    this.slider.style.setProperty('--thumb-offset', `${thumbWidth / 2}px`);
    };

    setupThumb(this.thumbLeft, this.inputLeft);
    setupThumb(this.thumbRight, this.inputRight);
}

/**
 * Initialize slider state
 * @private
 */
initState() {
    // Configure range inputs
    [this.inputLeft, this.inputRight].forEach((input) => {
    input.setAttribute('min', this.sliderMin);
    input.setAttribute('max', this.sliderMax);
    input.setAttribute('step', this.sliderSteps);
    input.setAttribute('formnovalidate', '');
    input.setAttribute('data-form-ignore', '');
    });

    // Set initial values from range inputs if they exist
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

/**
 * Formats a number with commas as thousand separators
 * @param {number} number - The number to format
 * @returns {string} The formatted number string
 * @private
 */
formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Updates all visual elements and values for the left handle
 * @private
 */
updateLeftValues(value) {
    const constrainedValue = Math.min(
    parseInt(value),
    parseInt(this.inputRight.value) - this.minDifference,
    );

    // Update slider input
    this.inputLeft.value = constrainedValue;

    // Update form input
    if (this.rangeStart) {
    // Avoid recursive reaction to our own programmatic updates
    const valueProp = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    this.__suspendExternalSync = true;
    valueProp.set.call(this.rangeStart, constrainedValue);
    this.__suspendExternalSync = false;
    }

    // Update display
    if (this.displayStart) {
    const displayLeft = this.shouldFormatNumber === 'true' ? this.formatNumber(constrainedValue) : constrainedValue;
    this.displayStart.textContent = String(displayLeft);
    }

    // Update visual position
    this.updateThumbPosition(
    this.inputLeft,
    this.thumbLeft,
    this.range,
    'left',
    );
}

/**
 * Updates all visual elements and values for the right handle
 * @private
 */
updateRightValues(value) {
    const constrainedValue = Math.max(
    parseInt(value),
    parseInt(this.inputLeft.value) + this.minDifference,
    );

    // Update slider input
    this.inputRight.value = constrainedValue;

    // Update form input
    if (this.rangeEnd) {
    // Avoid recursive reaction to our own programmatic updates
    const valueProp = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    this.__suspendExternalSync = true;
    valueProp.set.call(this.rangeEnd, constrainedValue);
    this.__suspendExternalSync = false;
    }

    // Update display
    if (this.displayEnd) {
    let finalDisplay = this.shouldFormatNumber === 'true' ? this.formatNumber(constrainedValue) : constrainedValue;

    if (this.rightSuffix && value >= this.sliderMax) {
        this.displayEnd.textContent = `${finalDisplay}${this.rightSuffix}`;
    } else if (this.defaultSuffix) {
        this.displayEnd.textContent = `${finalDisplay}${this.defaultSuffix}`;
    } else {
        this.displayEnd.textContent = String(finalDisplay);
    }
    }

    // Update visual position
    this.updateThumbPosition(
    this.inputRight,
    this.thumbRight,
    this.range,
    'right',
    );
}

/**
 * Sets up event listeners for the range slider
 * @private
 */
setupEventListeners() {
    // Input events for the slider inputs
    this.inputLeft.addEventListener('input', () => {
    this.updateLeftValues(this.inputLeft.value);
    if (this.rangeStart) {
        this.triggerEvent(this.rangeStart);
    }
    });

    this.inputRight.addEventListener('input', () => {
    this.updateRightValues(this.inputRight.value);
    if (this.rangeEnd) {
        this.triggerEvent(this.rangeEnd);
    }
    });

    // Watch for changes to the form inputs
    if (this.rangeStart) {
    // React to user typing immediately
    this.rangeStart.addEventListener('input', (e) => {
        this.updateLeftValues(e.target.value);
    });
    this.rangeStart.addEventListener('change', (e) => {
        this.updateLeftValues(e.target.value);
    });
    // Hook into programmatic value assignments
    this.hookInputValueSync(this.rangeStart, (val) => {
        this.updateLeftValues(val);
    });
    }

    if (this.rangeEnd) {
    // React to user typing immediately
    this.rangeEnd.addEventListener('input', (e) => {
        this.updateRightValues(e.target.value);
    });
    this.rangeEnd.addEventListener('change', (e) => {
        this.updateRightValues(e.target.value);
    });
    // Hook into programmatic value assignments
    this.hookInputValueSync(this.rangeEnd, (val) => {
        this.updateRightValues(val);
    });
    }
}

/**
 * Updates the position of a thumb element
 * @param {HTMLInputElement} input - The input element
 * @param {HTMLElement} thumb - The thumb element
 * @param {HTMLElement} range - The range element
 * @param {string} side - The side of the slider ('left' or 'right')
 * @private
 */
updateThumbPosition(input, thumb, range, side) {
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    const current = parseInt(input.value);
    const percent = ((current - min) / (max - min)) * 100;
    
    // Get the thumb's width to account for its dimensions
    const thumbWidth = thumb.offsetWidth || parseInt(getComputedStyle(thumb).width) || 20;
    const sliderWidth = this.slider.offsetWidth || parseInt(getComputedStyle(this.slider).width) || 1;
    
    // Calculate the percentage that represents half the thumb width
    const thumbHalfPercent = (thumbWidth / sliderWidth) * 100;

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

/**
 * Validates that a value is a valid number
 * @param {string} value - The value to validate
 * @returns {number} The parsed number
 * @throws {Error} If the value is not a valid number
 */
validateNumber(value) {
    const num = parseFloat(value);
    if (isNaN(num)) {
    throw new Error(`Invalid number value: ${value}`);
    }
    return num;
}

/**
 * Triggers an input event on an element
 * @param {HTMLElement} element - The element to trigger the event on
 * @private
 */
triggerEvent(element) {
    if (element) {
    element.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

/**
 * Hook into a text input's value property to react to programmatic assignments
 * @param {HTMLInputElement} input - The input to hook
 * @param {(val: string|number) => void} handler - Handler to run on assignment
 * @private
 */
hookInputValueSync(input, handler) {
    if (!input) return;
    const valueProp = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    const self = this;
    try {
        Object.defineProperty(input, 'value', {
        get() {
            return valueProp.get.call(this);
        },
        set(v) {
            valueProp.set.call(this, v);
            if (!self.__suspendExternalSync) {
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

/**
 * Public API: set left range value
 * @param {number|string} value
 */
setFrom(value) {
    this.updateLeftValues(value);
}

/**
 * Public API: set right range value
 * @param {number|string} value
 */
setTo(value) {
    this.updateRightValues(value);
}

/**
 * Public API: set both range values atomically and in correct order
 * @param {number|string} from
 * @param {number|string} to
 */
setRange(from, to) {
    this.updateLeftValues(from);
    this.updateRightValues(to);
}

/**
 * Public API: reset slider to configured bounds
 */
reset() {
    this.setRange(this.sliderMin, this.sliderMax);
}

/**
 * Validates that all required elements are present
 * @private
 * @throws {Error} If any required element is missing
 */
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

/**
 * Initialize all range sliders on the page
 */
const initializeRangeSlider = () => {
    try {
        window.webtricks = window.webtricks || [];
        const wrappers = document.querySelectorAll('[wt-rangeslider-element="slider-wrapper"]');

        if (!wrappers || wrappers.length === 0) return;

        wrappers.forEach(wrapper => {
            const instance = new RangeSlider(wrapper);
            window.webtricks.push({ 'RangeSlider': instance });
        });
    } catch (err) {
        console.error(`RangeSlider initialization error: ${err.message}`);
    }
};

// Initialize on DOM ready
if (/complete|interactive|loaded/.test(document.readyState)) {
    initializeRangeSlider();
} else {
    window.addEventListener('DOMContentLoaded', initializeRangeSlider);
}