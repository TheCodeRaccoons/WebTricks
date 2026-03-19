/** @jest-environment jsdom */

Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

describe('RangeSliderSimple', () => {
    let RangeSliderSimple;
    let InitializeRangeSliderSimple;

    beforeEach(() => {
        document.body.innerHTML = '';
        window.webtricks = [];
        jest.resetModules();
        ({
            RangeSliderSimple,
            InitializeRangeSliderSimple,
        } = require('../Dist/Functional/RangeSliderSimple.js'));
    });

    function mountSlider() {
        document.body.innerHTML = `
      <div wt-rangeslidersimple-element="slider-wrapper">
        <div wt-rangeslidersimple-display="from">0</div>
        <div wt-rangeslidersimple-display="to">100</div>
        <div wt-rangeslidersimple-element="slider"
             wt-rangeslidersimple-min="0"
             wt-rangeslidersimple-max="100"
             wt-rangeslidersimple-steps="1">
          <input type="range" wt-rangeslidersimple-element="input-left" />
          <input type="range" wt-rangeslidersimple-element="input-right" />
        </div>
      </div>
    `;
    }

    test('constructor wires inputs and displays', () => {
        mountSlider();
        const wrapper = document.querySelector(
            '[wt-rangeslidersimple-element="slider-wrapper"]',
        );
        const instance = new RangeSliderSimple(wrapper);
        const left = wrapper.querySelector(
            '[wt-rangeslidersimple-element="input-left"]',
        );
        const right = wrapper.querySelector(
            '[wt-rangeslidersimple-element="input-right"]',
        );
        expect(left.value).toBe('0');
        expect(right.value).toBe('100');
        expect(instance.sliderMin).toBe(0);
        expect(instance.sliderMax).toBe(100);
    });

    test('InitializeRangeSliderSimple pushes instance to webtricks', () => {
        mountSlider();
        InitializeRangeSliderSimple();
        expect(window.webtricks.some((e) => e.RangeSliderSimple)).toBe(true);
    });
});
