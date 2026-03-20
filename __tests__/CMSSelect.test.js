/** @jest-environment jsdom */

describe('CMSSelect', () => {
  let InitializeCMSSelect;

  beforeEach(() => {
    // Keep readyState as loading so auto init doesn't run before we call initializer
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });
    document.body.innerHTML = '';
    window.webtricks = [];
    jest.resetModules();
    ({ InitializeCMSSelect } = require('../Dist/WebflowOnly/CMSSelect.js'));
  });

  test('single select is populated with basic options', () => {
    document.body.innerHTML = `
      <select wt-cmsselect-element="select"></select>
      <div wt-cmsselect-element="target">Option 1</div>
      <div wt-cmsselect-element="target">Option 2</div>
      <div wt-cmsselect-element="target">Option 3</div>
    `;
    InitializeCMSSelect();
    const instance = window.webtricks.find(e => e.CMSSelect).CMSSelect;
    expect(instance.selectElement.options.length).toBe(3);
    expect(Array.from(instance.selectElement.options).map(o => o.text)).toEqual(['Option 1','Option 2','Option 3']);
  });

  test('custom value attribute overrides option value', () => {
    document.body.innerHTML = `
      <select wt-cmsselect-element="select"></select>
      <div wt-cmsselect-element="target" wt-cmsselect-value="val-a">Display A</div>
      <div wt-cmsselect-element="target" wt-cmsselect-value="val-b">Display B</div>
    `;
    InitializeCMSSelect();
    const instance = window.webtricks[0].CMSSelect;
    const values = Array.from(instance.selectElement.options).map(o => o.value);
    expect(values).toEqual(['val-a','val-b']);
  });

  test('empty text sources are ignored', () => {
    document.body.innerHTML = `
      <select wt-cmsselect-element="select"></select>
      <div wt-cmsselect-element="target">First</div>
      <div wt-cmsselect-element="target">   </div>
      <div wt-cmsselect-element="target"></div>
      <div wt-cmsselect-element="target">Last</div>
    `;
    InitializeCMSSelect();
    const instance = window.webtricks[0].CMSSelect;
    expect(instance.selectElement.options.length).toBe(2);
    expect(Array.from(instance.selectElement.options).map(o => o.text)).toEqual(['First','Last']);
  });

  test('multiple selects get their own target options', () => {
    document.body.innerHTML = `
      <select wt-cmsselect-element="select-1"></select>
      <select wt-cmsselect-element="select-2"></select>
      <div wt-cmsselect-element="target-1">Alpha</div>
      <div wt-cmsselect-element="target-1">Beta</div>
      <div wt-cmsselect-element="target-2">Gamma</div>
      <div wt-cmsselect-element="target-2">Delta</div>
    `;
    InitializeCMSSelect();
    const instances = window.webtricks.filter(e => e.CMSSelect).map(e => e.CMSSelect);
    expect(instances.length).toBe(2);
    const [first, second] = instances;
    expect(Array.from(first.selectElement.options).map(o => o.text)).toEqual(['Alpha','Beta']);
    expect(Array.from(second.selectElement.options).map(o => o.text)).toEqual(['Gamma','Delta']);
  });

  test('missing targets logs error and leaves select empty', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    document.body.innerHTML = `
      <select wt-cmsselect-element="select-3"></select>
    `;
    InitializeCMSSelect();
    const instance = window.webtricks[0].CMSSelect;
    expect(instance.selectElement.options.length).toBe(0);
    expect(spy).toHaveBeenCalled();
    const logged = spy.mock.calls.flat().join(' ');
    expect(logged).toMatch(/No options found/);
    spy.mockRestore();
  });

  test('falls back to text for value when custom value missing', () => {
    document.body.innerHTML = `
      <select wt-cmsselect-element="select"></select>
      <div wt-cmsselect-element="target">Plain Text</div>
    `;
    InitializeCMSSelect();
    const opt = window.webtricks[0].CMSSelect.selectElement.options[0];
    expect(opt.text).toBe('Plain Text');
    expect(opt.value).toBe('Plain Text');
  });
});
