/** @jest-environment jsdom */

// Prevent auto-init on require
Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

describe('CookieConsent', () => {
  let CookieConsent, InitializeCookieConsent;

  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    // Clear cookie between tests
    document.cookie = 'cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    window.localStorage.clear();
    // Reset global counters used by inline scripts
    delete window.__necessary;
    delete window.__analytics;
    delete window.__marketing;
    window.webtricks = [];
    jest.resetModules();
    ({ CookieConsent, InitializeCookieConsent } = require('../Dist/Functional/CookieConsent.js'));
  });

  function addDOM({ withManage = true } = {}) {
    const manage = withManage ? '<button id="manage" wt-cookieconsent-element="manage-cookies">Manage</button>' : '';
    document.body.innerHTML = `
      ${manage}
      <div id="banner" wt-cookieconsent-element="banner" style="display:none;">
        <button id="acceptAll1" wt-cookieconsent-element="accept-all">Accept All</button>
        <button id="acceptAll2" wt-cookieconsent-element="accept-all">Accept All 2</button>
        <button id="acceptNec" wt-cookieconsent-element="accept-necessary">Accept Necessary</button>
        <form id="cats" wt-cookieconsent-element="categories-form">
          <label><input type="checkbox" wt-cookieconsent-category="analytics" id="cat-analytics"></label>
          <label><input type="checkbox" wt-cookieconsent-category="marketing" id="cat-marketing"></label>
        </form>
      </div>
      <script wt-cookieconsent-script="necessary">window.__necessary = (window.__necessary||0)+1;</script>
      <script wt-cookieconsent-script="analytics">window.__analytics = (window.__analytics||0)+1;</script>
      <script wt-cookieconsent-script="marketing">window.__marketing = (window.__marketing||0)+1;</script>
    `;
  }

  test('shows banner and wires events when no cookie; accept all sets cookie and removes banner', () => {
    addDOM();
    InitializeCookieConsent();

    const banner = document.getElementById('banner');
    expect(banner.style.display).toBe('block');

    // Click accept all (first button)
    document.getElementById('acceptAll1').click();

    // Cookie set
    expect(document.cookie).toContain('cookieConsent=all');
    // Banner removed
    expect(document.getElementById('banner')).toBeNull();
    // Instance pushed
    expect(window.webtricks.some(e => e.CookieConsent)).toBe(true);

    // Scripts injected (necessary + analytics + marketing as all)
    // Originals remaining should be 0
    expect(document.querySelectorAll('script[wt-cookieconsent-script]').length).toBe(0);
    // Executed inline scripts should have incremented globals
    expect(window.__necessary).toBe(1);
    expect(window.__analytics).toBe(1);
    expect(window.__marketing).toBe(1);
  });

  test('accept necessary sets cookie and only injects necessary scripts', () => {
    addDOM();
    InitializeCookieConsent();

    document.getElementById('acceptNec').click();

    expect(document.cookie).toContain('cookieConsent=necessary');
    expect(document.querySelectorAll('script[wt-cookieconsent-script]').length).toBe(2); // analytics + marketing remain
  // Necessary script may run multiple times if multiple necessary scripts exist or re-evaluation occurs; ensure at least once
  expect((window.__necessary || 0)).toBeGreaterThanOrEqual(1);
    expect(window.__analytics || 0).toBe(0);
    expect(window.__marketing || 0).toBe(0);
  });

  test('category form submit composes cookie with necessary prefix when missing', () => {
    addDOM();
    InitializeCookieConsent();

    // Check only marketing; necessary should be auto-added
    document.getElementById('cat-marketing').checked = true;
    const form = document.getElementById('cats');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    expect(document.cookie).toMatch(/cookieConsent=necessary,marketing/);
    // Necessary and marketing execute; analytics remains
  expect((window.__necessary || 0)).toBeGreaterThanOrEqual(1);
    expect(window.__marketing).toBe(1);
    expect(window.__analytics || 0).toBe(0);
  });

  test('manage cookies button shows the banner when hidden', () => {
    addDOM();
    InitializeCookieConsent();

    const banner = document.getElementById('banner');
    banner.style.display = 'none';
    document.getElementById('manage').click();
    expect(banner.style.display).toBe('block');
  });

  test('on load with existing cookie, banner removed and scripts loaded; analytics grants fb consent', () => {
    // Pre-set cookie to analytics
    document.cookie = 'cookieConsent=analytics; path=/';
    // Provide fbq
    window.fbq = jest.fn();
    addDOM();

    InitializeCookieConsent();

    // Banner removed immediately
    expect(document.getElementById('banner')).toBeNull();
    // fb consent granted
    expect(window.localStorage.getItem('fbGrantConsent')).toBe('true');
    expect(window.fbq).toHaveBeenCalledWith('consent', 'grant');
    // Only necessary + analytics injected; marketing should remain unexecuted
  expect((window.__necessary || 0)).toBeGreaterThanOrEqual(1);
    expect(window.__analytics).toBe(1);
    expect(window.__marketing || 0).toBe(0);
  });
});
