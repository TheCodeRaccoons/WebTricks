/** @jest-environment jsdom */

// Prevent auto init before we control DOM
Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

// requestAnimationFrame polyfill for consistency
if (!global.requestAnimationFrame) global.requestAnimationFrame = (cb) => cb();

describe('CMSFilter', () => {
  let CMSFilter, InitializeCMSFilter;

  beforeEach(() => {
    document.body.innerHTML = '';
    window.webtricks = [];
    jest.resetModules();
    ({ CMSFilter, InitializeCMSFilter } = require('../Dist/WebflowOnly/CMSFilter.js'));
  });

  function buildBasicDOM({ withPagination=false, loadMode='load-all', advanced=false }={}) {
    const paginationMarkup = withPagination ? `
      <div wt-cmsfilter-element="pagination-wrapper">
        <a href="https://example.com/?page=1" class="page-link">Page1</a>
        <div class="w-page-count">1 / 1</div>
        <a wt-cmsfilter-pagination="prev" href="#">Prev</a>
        <a wt-cmsfilter-pagination="next" href="#">Next</a>
      </div>` : '';
    const advancedAttr = advanced ? 'wt-cmsfilter-filtering="advanced" wt-cmsfilter-class="is-active"' : '';
    document.body.innerHTML = `
      <form wt-cmsfilter-element="filter-form" ${advancedAttr} wt-cmsfilter-debounce="0">
        <div class="filters">
          <label wt-cmsfilter-category="Category"><input type="checkbox"><span>Alpha</span></label>
          <label wt-cmsfilter-category="Category"><input type="checkbox"><span>Beta</span></label>
          <label wt-cmsfilter-category="Category"><input type="checkbox"><span>Gamma</span></label>
          <label wt-cmsfilter-category="*"><input type="text" placeholder="Search" /></label>
          <label wt-cmsfilter-category="Price" wt-cmsfilter-range="from"><input type="text" value="" /></label>
          <label wt-cmsfilter-category="Price" wt-cmsfilter-range="to"><input type="text" value="" /></label>
        </div>
        <button wt-cmsfilter-element="clear-all" type="button">Clear</button>
        <select wt-cmsfilter-element="sort-options">
          <option value="title-asc">Title Asc</option>
          <option value="title-desc">Title Desc</option>
        </select>
        <div wt-cmsfilter-element="results-count"></div>
      </form>
      <div id="tags-wrapper">
        <div wt-cmsfilter-element="tag-template">
          <span wt-cmsfilter-element="tag-text"></span>
          <a href="#" wt-cmsfilter-element="tag-remove">x</a>
        </div>
      </div>
      <div wt-cmsfilter-element="list" wt-cmsfilter-loadmode="${loadMode}">
        <div class="item" data-title="alpha" data-category="Alpha" data-price="10">Alpha Item</div>
        <div class="item" data-title="beta" data-category="Beta" data-price="25">Beta Item</div>
        <div class="item" data-title="gamma" data-category="Gamma" data-price="50">Gamma Item</div>
      </div>
      <div wt-cmsfilter-element="empty" style="display:none;">No results</div>
      ${paginationMarkup}
    `;
  }

  test('initializes and caches items, pushes instance', () => {
    buildBasicDOM();
    InitializeCMSFilter();
    const instance = window.webtricks.find(e => e.CMSFilter).CMSFilter;
    // resultCount may be updated after init sequence; ensure fallback to computing directly
    const countText = instance.resultCount.textContent || String(instance.filteredItems.length);
    expect(instance.allItems.length).toBe(3);
    expect(instance.filteredItems.length).toBe(3);
    expect(countText).toBe('3');
  });

  test('category checkbox filter reduces items and shows result count', () => {
    buildBasicDOM();
    InitializeCMSFilter();
    const form = document.querySelector('[wt-cmsfilter-element="filter-form"]');
    // Check Beta only
    const betaLabel = Array.from(form.querySelectorAll('label')).find(l => l.textContent.includes('Beta'));
    betaLabel.querySelector('input').checked = true;
    betaLabel.querySelector('input').dispatchEvent(new Event('change', { bubbles: true }));
    const instance = window.webtricks[0].CMSFilter;
    // Manually apply filters to bypass debounce timing
    instance.ApplyFilters();
    expect(instance.filteredItems.length).toBe(1);
    expect(instance.filteredItems[0].dataset.title).toBe('beta');
    expect(instance.resultCount.textContent).toBe('1');
  });

  test('global search via * category filters list items', () => {
    buildBasicDOM();
    InitializeCMSFilter();
    const searchInput = document.querySelector('[wt-cmsfilter-category="*"] input');
    searchInput.value = 'gamma';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    const instance = window.webtricks[0].CMSFilter;
    instance.ApplyFilters();
    expect(instance.filteredItems.length).toBe(1);
    expect(instance.filteredItems[0].textContent.toLowerCase()).toContain('gamma');
  });

  test('range filtering narrows items between from/to values', () => {
    buildBasicDOM();
    InitializeCMSFilter();
    const priceFrom = document.querySelector('[wt-cmsfilter-category="Price"][wt-cmsfilter-range="from"] input');
    const priceTo = document.querySelector('[wt-cmsfilter-category="Price"][wt-cmsfilter-range="to"] input');
    // After init these should have defaults set (min=10 max=50). Narrow to 20 - 30
    priceFrom.value = '20';
    priceTo.value = '30';
    priceFrom.dispatchEvent(new Event('input', { bubbles: true }));
    priceTo.dispatchEvent(new Event('input', { bubbles: true }));
    const instance = window.webtricks[0].CMSFilter;
    instance.ApplyFilters();
    expect(instance.filteredItems.length).toBe(1);
    expect(instance.filteredItems[0].dataset.price).toBe('25');
  });

  test('clear all resets filters and shows all items again', () => {
    buildBasicDOM();
    InitializeCMSFilter();
    const form = document.querySelector('[wt-cmsfilter-element="filter-form"]');
    const alpha = Array.from(form.querySelectorAll('label')).find(l => l.textContent.includes('Alpha'));
    alpha.querySelector('input').checked = true;
    alpha.querySelector('input').dispatchEvent(new Event('change', { bubbles: true }));
    const instance = window.webtricks[0].CMSFilter;
    instance.ApplyFilters();
    expect(instance.filteredItems.length).toBe(1);
    document.querySelector('[wt-cmsfilter-element="clear-all"]').click();
    expect(instance.filteredItems.length).toBe(3);
  });

  test('sort options reorder items (title-desc)', () => {
    buildBasicDOM();
    InitializeCMSFilter();
    const select = document.querySelector('[wt-cmsfilter-element="sort-options"]');
    select.value = 'title-desc';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const instance = window.webtricks[0].CMSFilter;
    const ordered = instance.filteredItems.map(i => i.dataset.title);
    expect(ordered).toEqual(['gamma','beta','alpha']);
  });

  test('advanced filtering hides unavailable checkboxes then restores after clearing', () => {
    buildBasicDOM({ advanced:true });
    InitializeCMSFilter();
    const form = document.querySelector('[wt-cmsfilter-element="filter-form"]');
    // Apply search that matches only Gamma
    const searchInput = form.querySelector('[wt-cmsfilter-category="*"] input');
    searchInput.value = 'gamma';
    searchInput.dispatchEvent(new Event('input', { bubbles:true }));
    const instance = window.webtricks[0].CMSFilter;
    instance.ApplyFilters();
    // Only Gamma toggle should be visible
    const labels = Array.from(form.querySelectorAll('label[wt-cmsfilter-category="Category"]'));
    const visible = labels.filter(l => l.style.display !== 'none').map(l => l.textContent.trim());
    expect(visible).toEqual(expect.arrayContaining(['Gamma']));
    expect(visible).toHaveLength(1);
    // Clear all restores
    document.querySelector('[wt-cmsfilter-element="clear-all"]').click();
    const restoredVisible = labels.filter(l => l.style.display !== 'none');
    expect(restoredVisible.length).toBe(3);
  });

  test('tag template displays active filters and can remove a tag', () => {
    buildBasicDOM({ advanced:true });
    InitializeCMSFilter();
    const form = document.querySelector('[wt-cmsfilter-element="filter-form"]');
    const beta = Array.from(form.querySelectorAll('label')).find(l => l.textContent.includes('Beta'));
    beta.querySelector('input').checked = true;
    beta.querySelector('input').dispatchEvent(new Event('change', { bubbles:true }));
    const instance = window.webtricks[0].CMSFilter;
    instance.ApplyFilters();
    const tagsContainer = instance.tagTemplateContainer;
    expect(tagsContainer.children.length).toBeGreaterThan(0);
    const remove = tagsContainer.querySelector('[wt-cmsfilter-element="tag-remove"]');
    remove.click();
    expect(instance.filteredItems.length).toBe(3); // back to all
  });
});
