/** @jest-environment jsdom */

// Ensure the module doesn't auto-initialize on require
Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

describe('ShareLink', () => {
  let ShareLink, InitializeShareLink;

  beforeEach(() => {
    // Clean DOM
    document.body.innerHTML = '';
    // Reset globals
    window.webtricks = [];
    // Freshly require module each test to re-evaluate top-level
    jest.resetModules();
    ({ ShareLink, InitializeShareLink } = require('../Dist/Functional/ShareLink.js'));
  });

  test('InitializeShareLink wires up instance and pushes to webtricks', () => {
    document.body.innerHTML = `
      <div id="copyBtn" wt-share-element="copy" wt-share-copymessage="Copied!" wt-share-copymessage-fail="Failed" wt-share-copytimeout="20">
        <span>Copy Link</span>
      </div>
      <div wt-share-copyelement="copied"><span class='ok'>OK</span></div>
    `;

    // Mock clipboard
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    global.navigator.clipboard = { writeText: jest.fn().mockResolvedValue() };

    InitializeShareLink();

    const el = document.getElementById('copyBtn');
    expect(el._shareLinkInstance).toBeTruthy();
    expect(Array.isArray(window.webtricks)).toBe(true);
    expect(window.webtricks.some(e => e.ShareLink)).toBe(true);
  });

  test('copy success shows template HTML, dispatches event, and restores after timeout', async () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <a id="copyBtn" wt-share-element="copy" wt-share-copysuccess="copied-class" wt-share-copymessage-fail="Failed" wt-share-copytimeout="25">
        <span class='original'>Copy</span>
      </a>
      <div wt-share-copyelement="copied"><span class='ok'>OK</span></div>
    `;

    // Clipboard success path
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    const writeText = jest.fn().mockResolvedValue();
    global.navigator.clipboard = { writeText };

    InitializeShareLink();

    const el = document.getElementById('copyBtn');

    // Listen for the custom event
    const eventSpy = jest.fn();
    el.addEventListener('sharelink:copy', eventSpy);

  // Click to copy
  el.click();

  // Wait for async clipboard write to resolve
  await Promise.resolve();

  // Wrote to clipboard
  expect(writeText).toHaveBeenCalledTimes(1);
  expect(writeText).toHaveBeenCalledWith(window.location.href);

  // Success class applied and template HTML shown
  expect(el.classList.contains('copied-class')).toBe(true);
  expect(el.innerHTML).toContain('class="ok"');

    // Event dispatched with success detail
    expect(eventSpy).toHaveBeenCalledTimes(1);
    const evt = eventSpy.mock.calls[0][0];
    expect(evt.detail).toMatchObject({ success: true, platform: 'copy' });

    // After timeout, restore original
    jest.advanceTimersByTime(25);
  expect(el.innerHTML).toContain('class="original"');
    expect(el.classList.contains('copied-class')).toBe(false);

    jest.useRealTimers();
  });

  test('uses per-element template key when wt-share-copytemplate is provided', async () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <button id="copyBtn" wt-share-element="copy" wt-share-copytemplate="alt" wt-share-copysuccess="copied-class" wt-share-copytimeout="10">Go</button>
      <div wt-share-copyelement="copied"><span>DEFAULT</span></div>
      <div wt-share-copyelement="alt"><span class="alt">ALT</span></div>
    `;

    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    const writeText = jest.fn().mockResolvedValue();
    global.navigator.clipboard = { writeText };

    InitializeShareLink();

    const el = document.getElementById('copyBtn');
    el.click();
    await Promise.resolve();

    expect(writeText).toHaveBeenCalled();
    expect(el.innerHTML).toContain('class="alt"');

    jest.advanceTimersByTime(10);
    jest.useRealTimers();
  });

  test('fallback uses execCommand when clipboard is unavailable', () => {
    jest.useFakeTimers();

    document.body.innerHTML = `
      <button id="copyBtn" wt-share-element="copy" wt-share-copymessage="Copied!" wt-share-copymessage-fail="Failed" wt-share-copytimeout="10">
        Copy
      </button>
      <div wt-share-copyelement="copied"><span class='ok'>OK</span></div>
    `;

    // No secure context / no clipboard API
    Object.defineProperty(window, 'isSecureContext', { value: false, configurable: true });
    delete global.navigator.clipboard;

  // Mock execCommand (jsdom doesn't implement it by default)
  document.execCommand = jest.fn(() => true);

    InitializeShareLink();

    const el = document.getElementById('copyBtn');

    // Listen for the custom event
    const eventSpy = jest.fn();
    el.addEventListener('sharelink:copy', eventSpy);

    el.click();

  expect(document.execCommand).toHaveBeenCalledWith('copy');
    // Event dispatched
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(eventSpy.mock.calls[0][0].detail.success).toBe(true);

    // Restore
    jest.advanceTimersByTime(10);

    // Cleanup
    delete document.execCommand;
    jest.useRealTimers();
  });
});
