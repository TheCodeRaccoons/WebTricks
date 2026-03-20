/** @jest-environment jsdom */

// Prevent auto-initialize on require
Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

// jsdom innerText polyfill mapping to textContent
if (!('innerText' in document.createElement('div'))) {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get() { return this.textContent; },
    set(v) { this.textContent = v; }
  });
}

describe('CopyToClipboard', () => {
  let CopyToClipboard, InitializeCopyToClipboard;

  beforeEach(() => {
    document.body.innerHTML = '';
    window.webtricks = [];
    jest.resetModules();
    ({ CopyToClipboard, InitializeCopyToClipboard } = require('../Dist/Functional/CopyToClipboard.js'));
  });

  test('InitializeCopyToClipboard creates instance and pushes to webtricks', () => {
    document.body.innerHTML = `
      <div id="ctc" wt-copycb-element="container">
        <button id="trigger" wt-copycb-element="trigger" wt-copycb-message="Copied!"> 
          <span wt-copycb-element="texttarget">Copy</span>
        </button>
        <div wt-copycb-element="target">Hello World</div>
      </div>
    `;

    // Clipboard present but we won't assert calls in this test
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    global.navigator.clipboard = { writeText: jest.fn().mockResolvedValue() };

    InitializeCopyToClipboard();

    expect(Array.isArray(window.webtricks)).toBe(true);
    expect(window.webtricks.length).toBe(1);
    const entry = window.webtricks[0];
    expect(entry && entry.CopyToClipboard).toBeTruthy();

    // Instance has expected wiring
    const instance = entry.CopyToClipboard;
    const container = document.getElementById('ctc');
    expect(instance.ctcContainer).toBe(container);
    expect(instance.ctcTrigger).toBe(document.getElementById('trigger'));
  });

  test('Click updates texttarget, toggles class, writes to clipboard, and resets', async () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div wt-copycb-element="container">
        <button id="trigger" wt-copycb-element="trigger" wt-copycb-message="Copied!" wt-copycb-active="copied" wt-copycb-timeout="25">
          <span id="tt" wt-copycb-element="texttarget">Copy</span>
        </button>
        <div wt-copycb-element="target">SECRET TEXT</div>
      </div>
    `;

    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    const writeText = jest.fn().mockResolvedValue();
    global.navigator.clipboard = { writeText };

    InitializeCopyToClipboard();

    const trigger = document.getElementById('trigger');
    const textTarget = document.getElementById('tt');

    // Click to copy
    trigger.click();

    // Clipboard called with target text
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith('SECRET TEXT');

    // Text swap and class toggle
    expect(textTarget.textContent).toBe('Copied!');
    expect(trigger.classList.contains('copied')).toBe(true);

    // After timeout, restored
    jest.advanceTimersByTime(25);
  expect(textTarget.textContent.trim()).toBe('Copy');
    expect(trigger.classList.contains('copied')).toBe(false);

    jest.useRealTimers();
  });

  test('Without texttarget, trigger text updates and resets', () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div wt-copycb-element="container">
        <button id="trigger" wt-copycb-element="trigger" wt-copycb-message="Done" wt-copycb-timeout="10">Copy Now</button>
        <div wt-copycb-element="target">A</div>
      </div>
    `;

    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    global.navigator.clipboard = { writeText: jest.fn().mockResolvedValue() };

    InitializeCopyToClipboard();

    const trigger = document.getElementById('trigger');
    trigger.click();

    expect(trigger.textContent).toBe('Done');

    jest.advanceTimersByTime(10);
    expect(trigger.textContent).toBe('Copy Now');

    jest.useRealTimers();
  });

  test('If target missing, no listener is attached (no clipboard call/changes on click)', () => {
    document.body.innerHTML = `
      <div wt-copycb-element="container">
        <button id="trigger" wt-copycb-element="trigger" wt-copycb-message="Copied!">Copy</button>
        <!-- Missing [wt-copycb-element="target"] -->
      </div>
    `;

    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    const writeText = jest.fn();
    global.navigator.clipboard = { writeText };

    InitializeCopyToClipboard();

    const trigger = document.getElementById('trigger');
    trigger.click();

    // No copy attempted, text unchanged
    expect(writeText).not.toHaveBeenCalled();
    expect(trigger.textContent).toBe('Copy');
  });

  test('No copied message leaves text intact but toggles active class if provided', () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <div wt-copycb-element="container">
        <button id="trigger" wt-copycb-element="trigger" wt-copycb-active="is-copy" wt-copycb-timeout="5">Copy</button>
        <div wt-copycb-element="target">DATA</div>
      </div>
    `;

    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    global.navigator.clipboard = { writeText: jest.fn().mockResolvedValue() };

    InitializeCopyToClipboard();

    const trigger = document.getElementById('trigger');
    trigger.click();

    // Text remained the same
    expect(trigger.textContent).toBe('Copy');
    // Class toggled on
    expect(trigger.classList.contains('is-copy')).toBe(true);

    jest.advanceTimersByTime(5);
    // Class toggled off
    expect(trigger.classList.contains('is-copy')).toBe(false);

    jest.useRealTimers();
  });
});
