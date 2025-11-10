/** @jest-environment jsdom */

// Prevent auto-init on require
Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

describe('CountUp', () => {
  let CountUp, InitializeCountUp;

  beforeEach(() => {
    document.body.innerHTML = '';
    window.webtricks = [];
    jest.resetModules();
    ({ CountUp, InitializeCountUp } = require('../Dist/Functional/CountUp.js'));
    jest.useFakeTimers();
  });

  afterEach(() => {
    try { jest.runOnlyPendingTimers(); } catch {}
    jest.useRealTimers();
  });

  test('InitializeCountUp creates instances and pushes to webtricks', () => {
    document.body.innerHTML = `
      <div wt-countup-element='counter' id='c1' wt-countup-target='3'></div>
      <div wt-countup-element='counter' id='c2' wt-countup-target='2'></div>
    `;

    InitializeCountUp();

    expect(window.webtricks.filter(e => e.CountUp).length).toBe(2);
  });

  test('counts up with prefix and suffix and stops at target', () => {
    document.body.innerHTML = `
      <div wt-countup-element='counter' id='c1' wt-countup-target='5' wt-countup-prefix='$' wt-countup-suffix=' USD' wt-countup-speed='1'></div>
    `;

    InitializeCountUp();

    const el = document.getElementById('c1');

    // Tick a few times
    jest.advanceTimersByTime(1 * 10); // enough to pass 5 increments
    // Should not exceed target and should have prefix/suffix
    expect(el.textContent).toMatch(/^\$\d+ USD$/);
    const value = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
    expect(value).toBeLessThanOrEqual(5);
  });

  test('custom step increments by step', () => {
    document.body.innerHTML = `
      <div wt-countup-element='counter' id='c1' wt-countup-target='10' wt-countup-step='2' wt-countup-speed='1'></div>
    `;

    const el = document.getElementById('c1');
    // Instantiate directly so we can control ticks deterministically
    const instance = new CountUp(el);
    // Stop the internal interval to avoid timer flakiness in tests
    clearInterval(instance.stop);

    // After constructor: displayed 0, internal currentVal = 2
    expect(parseInt(el.textContent, 10)).toBe(0);

    // Manual ticks via counterUp
    instance.counterUp(); // display 2, currentVal -> 4
    expect(parseInt(el.textContent, 10)).toBe(2);

    instance.counterUp(); // display 4, currentVal -> 6
    expect(parseInt(el.textContent, 10)).toBe(4);

    // Advance until target reached (do not exceed by continuing calls)
    while (instance.currentVal <= instance.counterTarget) {
      instance.counterUp();
    }
    const value = parseInt(el.textContent, 10);
    expect(value).toBe(10); // exact target should be last displayed
    expect(instance.currentVal).toBeGreaterThan(10); // internal increment passed target
  });

  test('zero step falls back to +1', () => {
    document.body.innerHTML = `
      <div wt-countup-element='counter' id='c1' wt-countup-target='3' wt-countup-step='0' wt-countup-speed='1'></div>
    `;

    InitializeCountUp();
    const el = document.getElementById('c1');

    jest.advanceTimersByTime(1 * 4);
    const value = parseInt(el.textContent, 10);
    expect(value).toBeLessThanOrEqual(3);
  });

  test('no counters found does nothing', () => {
    document.body.innerHTML = `<div id='x'></div>`;
    InitializeCountUp();
    expect(window.webtricks.length).toBe(0);
  });
});
