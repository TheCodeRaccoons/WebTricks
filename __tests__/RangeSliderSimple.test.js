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
        const displayFrom = wrapper.querySelector(
            '[wt-rangeslidersimple-display="from"]',
        );
        const displayTo = wrapper.querySelector(
            '[wt-rangeslidersimple-display="to"]',
        );
        expect(left.value).toBe('0');
        expect(right.value).toBe('100');
        expect(left.min).toBe('0');
        expect(left.max).toBe('100');
        expect(left.step).toBe('1');
        expect(displayFrom.textContent).toBe('0');
        expect(displayTo.textContent).toBe('100');
        expect(instance.sliderMin).toBe(0);
        expect(instance.sliderMax).toBe(100);
    });

    test('InitializeRangeSliderSimple pushes instance to webtricks', () => {
        mountSlider();
        InitializeRangeSliderSimple();
        expect(window.webtricks.some((e) => e.RangeSliderSimple)).toBe(true);
    });

    test('integer step and minDifference still constrain (parseFloat handles whole numbers)', () => {
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

        instance.setTo('20');
        instance.setFrom('25');

        // min(25, 20 - 1) = 19 with default mindifference === steps === 1
        expect(left.value).toBe('19');
        expect(right.value).toBe('20');
    });

    test('decimal minDifference constrains with floats, not parseInt truncation', () => {
        document.body.innerHTML = `
      <div wt-rangeslidersimple-element="slider-wrapper">
        <div wt-rangeslidersimple-element="slider"
             wt-rangeslidersimple-min="0"
             wt-rangeslidersimple-max="10"
             wt-rangeslidersimple-steps="0.1"
             wt-rangeslidersimple-mindifference="0.3">
          <input type="range" wt-rangeslidersimple-element="input-left" />
          <input type="range" wt-rangeslidersimple-element="input-right" />
        </div>
      </div>
    `;
        const wrapper = document.querySelector(
            '[wt-rangeslidersimple-element="slider-wrapper"]',
        );
        const instance = new RangeSliderSimple(wrapper);

        instance.setTo('5');
        instance.setFrom('4.9');

        // min(4.9, 5 - 0.3) = 4.7 — parseInt would wrongly yield 4
        expect(
            wrapper.querySelector('[wt-rangeslidersimple-element="input-left"]')
                .value,
        ).toBe('4.7');
        expect(
            wrapper.querySelector('[wt-rangeslidersimple-element="input-right"]')
                .value,
        ).toBe('5');
    });

    test('constrainRightValue keeps at least minDifference above left handle', () => {
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

        instance.setFrom('60');
        instance.setTo('30');

        // max(30, 60 + 1) = 61 with mindifference === 1
        expect(left.value).toBe('60');
        expect(right.value).toBe('61');
    });

    test('reset restores min and max on both inputs', () => {
        mountSlider();
        const wrapper = document.querySelector(
            '[wt-rangeslidersimple-element="slider-wrapper"]',
        );
        const instance = new RangeSliderSimple(wrapper);
        instance.setRange('40', '50');
        instance.reset();
        const left = wrapper.querySelector(
            '[wt-rangeslidersimple-element="input-left"]',
        );
        const right = wrapper.querySelector(
            '[wt-rangeslidersimple-element="input-right"]',
        );
        expect(left.value).toBe('0');
        expect(right.value).toBe('100');
    });
});
