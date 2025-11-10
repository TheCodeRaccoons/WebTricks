/** @jest-environment jsdom */

// Prevent auto init on require
Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

describe('NumberFormatter', () => {
  let NumberFormatter, InitializeFormatNumbers;

  beforeEach(() => {
    document.body.innerHTML = '';
    window.webtricks = [];
    jest.resetModules();
    ({ NumberFormatter, InitializeFormatNumbers } = require('../Dist/Functional/FormatNumbers.js'));
  });

  test('formats plain decimal number with en-US locale default style=decimal', () => {
    document.body.innerHTML = `
      <div wt-formatnumber-element="number" wt-formatnumber-style="decimal" wt-formatnumber-locales="en-US">1234567.89</div>
    `;
    InitializeFormatNumbers();
    const el = document.querySelector('[wt-formatnumber-element="number"]');
    // Expect grouping and decimal
    expect(el.textContent).toBe('1,234,567.89');
  });

  test('currency formatting applies symbol and grouping', () => {
    document.body.innerHTML = `
      <div wt-formatnumber-element="number" wt-formatnumber-style="currency" wt-formatnumber-currency="USD" wt-formatnumber-locales="en-US">9876.5</div>
    `;
    InitializeFormatNumbers();
    const el = document.querySelector('[wt-formatnumber-element="number"]');
    // Currency formatting: "$9,876.50" (locale dependent but stable in jsdom Node)
    expect(el.textContent).toMatch(/\$9,?876\.50/);
  });

  test('percent style formats number as percent', () => {
    document.body.innerHTML = `
      <div wt-formatnumber-element="number" wt-formatnumber-style="percent" wt-formatnumber-locales="en-US">0.256</div>
    `;
    InitializeFormatNumbers();
    const el = document.querySelector('[wt-formatnumber-element="number"]');
    expect(el.textContent).toBe('26%'); // typical rounding
  });

  test('unit style with provided unit', () => {
    document.body.innerHTML = `
      <div wt-formatnumber-element="number" wt-formatnumber-style="unit" wt-formatnumber-unit="kilometer" wt-formatnumber-locales="en-US">1500</div>
    `;
    InitializeFormatNumbers();
    const el = document.querySelector('[wt-formatnumber-element="number"]');
    // Example output "1,500 km"; unit formatting may vary slightly, so assert contains km
    expect(el.textContent).toMatch(/1,?500.*km/i);
  });

  test('invalid style causes graceful error logging and leaves value intact', () => {
    const originalError = console.error; const errSpy = jest.fn(); console.error = errSpy;
    document.body.innerHTML = `
      <div wt-formatnumber-element="number" wt-formatnumber-style="funky" wt-formatnumber-locales="en-US">1234</div>
    `;
    InitializeFormatNumbers();
    const el = document.querySelector('[wt-formatnumber-element="number"]');
    // Should not format, error logged, text still original
    expect(el.textContent).toBe('1234');
    expect(errSpy).toHaveBeenCalled();
    console.error = originalError;
  });

  test('invalid number value logs error and leaves content', () => {
    const originalError = console.error; const errSpy = jest.fn(); console.error = errSpy;
    document.body.innerHTML = `
      <div wt-formatnumber-element="number" wt-formatnumber-style="decimal" wt-formatnumber-locales="en-US">abc</div>
    `;
    InitializeFormatNumbers();
    const el = document.querySelector('[wt-formatnumber-element="number"]');
    expect(el.textContent).toBe('abc');
    expect(errSpy).toHaveBeenCalled();
    console.error = originalError;
  });

  test('multiple numbers produce multiple instances pushed to webtricks', () => {
    document.body.innerHTML = `
      <div wt-formatnumber-element="number" wt-formatnumber-style="decimal" wt-formatnumber-locales="en-US">1000</div>
      <div wt-formatnumber-element="number" wt-formatnumber-style="decimal" wt-formatnumber-locales="en-US">2000</div>
    `;
    InitializeFormatNumbers();
    expect(window.webtricks.filter(e => e.FormatNumber).length).toBe(2);
  });

  test('no elements to format logs error but does not throw', () => {
    const originalError = console.error; const errSpy = jest.fn(); console.error = errSpy;
    InitializeFormatNumbers();
    expect(errSpy).toHaveBeenCalled();
    console.error = originalError;
  });
});
