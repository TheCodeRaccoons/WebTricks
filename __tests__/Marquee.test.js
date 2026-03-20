/** @jest-environment jsdom */

// Prevent auto-init on require
Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

// requestAnimationFrame polyfill for jsdom
if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (cb) => cb();
}

describe('Marquee', () => {
  let Marquee, InitializeMarquee;
  const origGetComputedStyle = window.getComputedStyle;

  beforeEach(() => {
    document.body.innerHTML = '';
    window.webtricks = [];
    jest.resetModules();
    // Default: no gap
    window.getComputedStyle = jest.fn(() => ({ gap: '0' }));
    ({ Marquee, InitializeMarquee } = require('../Dist/Functional/Marquee.js'));
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Proactively stop any running marquee intervals to avoid hanging timers
    try {
      if (Array.isArray(window.webtricks)) {
        window.webtricks.forEach(entry => {
          const inst = entry && (entry.Marquee || entry.marquee || entry.marqueeInstance);
          if (inst && typeof inst.stopMarquee === 'function') {
            inst.stopMarquee();
          }
        });
      }
    } catch {}
    // Drain pending timers before switching back to real timers
    try { jest.runOnlyPendingTimers(); } catch {}
    window.getComputedStyle = origGetComputedStyle;
    jest.useRealTimers();
  });

  function setOffsetWidth(el, value) {
    Object.defineProperty(el, 'offsetWidth', { value, configurable: true });
  }
  function setOffsetHeight(el, value) {
    Object.defineProperty(el, 'offsetHeight', { value, configurable: true });
  }

  test('InitializeMarquee sets styles, clones to fill, and pushes instance', () => {
    document.body.innerHTML = `
      <div id="parent" style="width:400px">
        <div id="mq" wt-marquee-element="container">
          <span class="item">A</span>
          <span class="item">B</span>
        </div>
      </div>
    `;
    const parent = document.getElementById('parent');
    const container = document.getElementById('mq');
    const [a, b] = container.children;
    // Define dimensions
    setOffsetWidth(parent, 400);
    setOffsetWidth(container, 100);
    setOffsetWidth(a, 50);
    setOffsetWidth(b, 50);

    InitializeMarquee();

    // One instance pushed
    expect(window.webtricks.some(e => e.Marquee)).toBe(true);
    // Styles applied
    expect(container.style.display).toBe('flex');
    expect(container.style.flexDirection).toBe('row');

  // Should clone at least once ( > initial 2 children )
  expect(container.children.length).toBeGreaterThan(2);
  });

  test('Left direction scrolls and cycles first element after threshold', () => {
    document.body.innerHTML = `
      <div id="parent">
        <div id="mq" wt-marquee-element="container" wt-marquee-direction="left" wt-marquee-speed="5">
          <span class="item">A</span>
          <span class="item">B</span>
        </div>
      </div>
    `;
    const parent = document.getElementById('parent');
    const container = document.getElementById('mq');
    const itemA = container.children[0];
    const itemB = container.children[1];
    setOffsetWidth(parent, 200);
    setOffsetWidth(container, 100);
    setOffsetWidth(itemA, 50);
    setOffsetWidth(itemB, 50);

    InitializeMarquee();

    const instance = window.webtricks[0].Marquee;

    // One tick => transform -1px on X
    jest.advanceTimersByTime(5);
    expect(container.style.transform).toBe('translate3d(-1px, 0, 0)');

    const firstBefore = container.firstElementChild;

    // After 51 ticks, first item should have cycled to end
    jest.advanceTimersByTime(5 * 51);
    const firstAfter = container.firstElementChild;
    const lastAfter = container.lastElementChild;

    expect(firstAfter).not.toBe(firstBefore);
    expect(lastAfter.textContent).toBe(firstBefore.textContent);

    // Keep ESLint/unused vars happy
    expect(instance).toBeTruthy();
  });

  test('Right direction scrolls and moves last before first quickly', () => {
    document.body.innerHTML = `
      <div id="parent">
        <div id="mq" wt-marquee-element="container" wt-marquee-direction="right" wt-marquee-speed="5">
          <span class="item">A</span>
          <span class="item">B</span>
        </div>
      </div>
    `;
    const parent = document.getElementById('parent');
    const container = document.getElementById('mq');
    const itemA = container.children[0];
    const itemB = container.children[1];
    setOffsetWidth(parent, 200);
    setOffsetWidth(container, 100);
    setOffsetWidth(itemA, 50);
    setOffsetWidth(itemB, 50);

    InitializeMarquee();

    const firstBefore = container.firstElementChild;
    // First tick: x becomes +1
    jest.advanceTimersByTime(5);
    expect(container.style.transform).toBe('translate3d(1px, 0, 0)');

    // Because of logic threshold, last should have moved before first
    const firstAfter = container.firstElementChild;
    expect(firstAfter.textContent).toBe('B');
    expect(firstAfter).not.toBe(firstBefore);
  });

  test('Resize increases parent size and triggers refill and restart', () => {
    document.body.innerHTML = `
      <div id="parent">
        <div id="mq" wt-marquee-element="container" wt-marquee-direction="left" wt-marquee-speed="5">
          <span class="item">A</span>
          <span class="item">B</span>
        </div>
      </div>
    `;
    const parent = document.getElementById('parent');
    const container = document.getElementById('mq');
    const itemA = container.children[0];
    const itemB = container.children[1];
    setOffsetWidth(parent, 200);
    setOffsetWidth(container, 100);
    setOffsetWidth(itemA, 50);
    setOffsetWidth(itemB, 50);

    InitializeMarquee();

    const countBefore = container.children.length;

    // Increase parent size and dispatch resize
    Object.defineProperty(parent, 'offsetWidth', { value: 600, configurable: true });
    window.dispatchEvent(new Event('resize'));

    // Let resize handler run start/clone
    jest.advanceTimersByTime(5);

    const countAfter = container.children.length;
    expect(countAfter).toBeGreaterThan(countBefore);
  });
});
