/** @jest-environment jsdom */

// Prevent auto-init on require
Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

// jsdom innerText polyfill
if (!('innerText' in document.createElement('div'))) {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get() { return this.textContent; },
    set(v) { this.textContent = v; }
  });
}

describe('ReadTime', () => {
  let ReadTime, InitializeReadTime;

  beforeEach(() => {
    document.body.innerHTML = '';
    window.webtricks = [];
    jest.resetModules();
    ({ ReadTime, InitializeReadTime } = require('../Dist/Functional/ReadTime.js'));
  });

  test('less than a minute uses default when no smallsuffix', () => {
    document.body.innerHTML = `
      <article wt-readtime-element="article">one two three four five six seven eight nine ten</article>
      <span id="d1" wt-readtime-element="display"></span>
    `;

    InitializeReadTime();

    expect(window.webtricks.some(e => e.ReadTime)).toBe(true);
    const d1 = document.getElementById('d1');
    expect(d1.textContent).toBe('less than a minute.');
  });

  test('less than a minute uses provided smallsuffix', () => {
    document.body.innerHTML = `
      <article wt-readtime-element="article" wt-readtime-smallsuffix="<1 min">one two three</article>
      <span id="d1" wt-readtime-element="display"></span>
      <span id="d2" wt-readtime-element="display"></span>
    `;

    InitializeReadTime();

    expect(document.getElementById('d1').textContent).toBe('<1 min');
    expect(document.getElementById('d2').textContent).toBe('<1 min');
  });

  test('exactly one minute renders "a minute."', () => {
    document.body.innerHTML = `
      <article wt-readtime-element="article" wt-readtime-words="5">one two three four five</article>
      <span id="d1" wt-readtime-element="display"></span>
    `;

    InitializeReadTime();

    expect(document.getElementById('d1').textContent).toBe('a minute.');
  });

  test('more than one minute uses ceil(rawTime) with suffix when provided', () => {
    document.body.innerHTML = `
      <article wt-readtime-element="article" wt-readtime-words="5" wt-readtime-suffix="min read">one two three four five six</article>
      <span id="d1" wt-readtime-element="display"></span>
    `;

    InitializeReadTime();

    expect(document.getElementById('d1').textContent).toBe('2 min read');
  });

  test('no articles found does not throw and does not push instances', () => {
    document.body.innerHTML = `
      <span id="d1" wt-readtime-element="display"></span>
    `;

    InitializeReadTime();

    expect(Array.isArray(window.webtricks)).toBe(true);
    expect(window.webtricks.length).toBe(0);
  });
});
