/** @jest-environment jsdom */

Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

describe('RangeSlider', () => {
    let RangeSlider;
    let InitializeRangeSlider;

    beforeEach(() => {
        document.body.innerHTML = '';
        window.webtricks = [];
        jest.resetModules();
        ({ RangeSlider, InitializeRangeSlider } = require('../Dist/Functional/RangeSlider.js'));
    });

    function mountRangeSlider() {
        document.body.innerHTML = `
      <div wt-rangeslider-element="slider-wrapper">
        <div wt-rangeslider-element="slider"
             wt-rangeslider-min="0"
             wt-rangeslider-max="100"
             wt-rangeslider-steps="1">
          <div wt-rangeslider-element="range"></div>
          <div wt-rangeslider-element="thumb-left"></div>
          <div wt-rangeslider-element="thumb-right"></div>
          <input type="range" wt-rangeslider-element="input-left" />
          <input type="range" wt-rangeslider-element="input-right" />
        </div>
      </div>
    `;
    }

    test('constructor sets initial values from min/max', () => {
        mountRangeSlider();
        const wrapper = document.querySelector(
            '[wt-rangeslider-element="slider-wrapper"]',
        );
        new RangeSlider(wrapper);
        const left = wrapper.querySelector('[wt-rangeslider-element="input-left"]');
        const right = wrapper.querySelector('[wt-rangeslider-element="input-right"]');
        expect(left.value).toBe('0');
        expect(right.value).toBe('100');
    });

    test('InitializeRangeSlider pushes instance to webtricks', () => {
        mountRangeSlider();
        InitializeRangeSlider();
        expect(window.webtricks.some((e) => e.RangeSlider)).toBe(true);
    });
});
