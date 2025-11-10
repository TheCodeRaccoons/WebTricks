/** @jest-environment jsdom */

// Prevent auto-init on require
Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

describe('FormCheck', () => {
  let FormCheck, InitializeFormCheck;

  beforeEach(() => {
    document.body.innerHTML = '';
    window.webtricks = [];
    jest.resetModules();
    ({ FormCheck, InitializeFormCheck } = require('../Dist/Functional/FormCheck.js'));
  });

  function buildBasicForm({ includeDefaultSubmit = true } = {}) {
    const defaultSubmit = includeDefaultSubmit
      ? '<button id="def" wt-formcheck-element="default-submit" type="button">Hidden Submit</button>'
      : '';
    document.body.innerHTML = `
      <form id="f" wt-formcheck-element="form" wt-formcheck-class="has-error" wt-formcheck-message="Thanks!">
        <div>
          <input id="name" type="text" wt-formcheck-type="required" />
          <div id="nameErr" wt-formcheck-type="error">Name is required</div>
        </div>
        <button id="submit" wt-formcheck-type="submit" type="button">Send</button>
        ${defaultSubmit}
        <button id="reset" wt-formcheck-element="reset" type="button">Reset</button>
      </form>
    `;
  }

  test('initialization hides error elements, removes error class, and pushes instance', () => {
    buildBasicForm();
    const err = document.getElementById('nameErr');
    // Set visible and add class before init to ensure it gets cleared
    err.style.display = 'block';
    const field = document.getElementById('name');
    field.classList.add('has-error');

    InitializeFormCheck();

    expect(err.style.display).toBe('none');
    expect(field.classList.contains('has-error')).toBe(false);
    expect(window.webtricks.some(e => e.FormCheck)).toBe(true);
  });

  test('invalid required field shows error and prevents success actions', () => {
    buildBasicForm();
    InitializeFormCheck();

    const field = document.getElementById('name');
    const err = document.getElementById('nameErr');
    const def = document.getElementById('def');
    const defClick = jest.fn();
    def.click = defClick;

    // Click submit with empty field
    document.getElementById('submit').click();

    // Error shown and class added
    expect(err.style.display).toBe('block');
    expect(field.classList.contains('has-error')).toBe(true);
    // No success action
    expect(defClick).not.toHaveBeenCalled();
  });

  test('success path with default submit button updates label and triggers default submit', () => {
    buildBasicForm();
    InitializeFormCheck();

    const field = document.getElementById('name');
    field.value = 'Alice';

    const def = document.getElementById('def');
    const defClick = jest.fn();
    def.click = defClick;

    const submitBtn = document.getElementById('submit');
    submitBtn.click();

    expect(defClick).toHaveBeenCalled();
    expect(submitBtn.textContent).toBe('Thanks!');
  });

  test('success path without default submit calls form.submit', () => {
    buildBasicForm({ includeDefaultSubmit: false });
    const form = document.getElementById('f');
    form.submit = jest.fn();

    InitializeFormCheck();
    document.getElementById('name').value = 'Bob';
    document.getElementById('submit').click();

    expect(form.submit).toHaveBeenCalled();
  });

  test('clearError hides error and removes class on keypress/blur', () => {
    buildBasicForm();
    InitializeFormCheck();

    const field = document.getElementById('name');
    const err = document.getElementById('nameErr');

    // Cause an error first
    document.getElementById('submit').click();
    expect(err.style.display).toBe('block');
    expect(field.classList.contains('has-error')).toBe(true);

    // Trigger keypress to clear
    field.dispatchEvent(new Event('keypress', { bubbles: true }));
    expect(err.style.display).toBe('none');
    expect(field.classList.contains('has-error')).toBe(false);
  });

  test('reset clears errors, classes, and restores submit button text', () => {
    buildBasicForm();
    InitializeFormCheck();

    const field = document.getElementById('name');
    const err = document.getElementById('nameErr');
    const submitBtn = document.getElementById('submit');

    // Cause an error and change label via success then reset
    document.getElementById('submit').click(); // set error
    field.value = 'Now valid';
    // Simulate success to change label
    const def = document.getElementById('def');
    def.click = jest.fn();
    submitBtn.click();
    expect(submitBtn.textContent).toBe('Thanks!');

    // Reset
    document.getElementById('reset').click();
    expect(err.style.display).toBe('none');
    expect(field.classList.contains('has-error')).toBe(false);
    expect(submitBtn.textContent).toBe('Send');
  });

  test('type validations: email/number/tel/checkbox', () => {
    document.body.innerHTML = `
      <form id="f" wt-formcheck-element="form" wt-formcheck-class="has-error" wt-formcheck-message="Go">
        <div>
          <input id="em" type="email" wt-formcheck-type="required" />
          <div id="emErr" wt-formcheck-type="error">email err</div>
        </div>
        <div>
          <input id="num" type="number" wt-formcheck-type="required" />
          <div id="numErr" wt-formcheck-type="error">num err</div>
        </div>
        <div>
          <input id="tel" type="tel" wt-formcheck-type="required" />
          <div id="telErr" wt-formcheck-type="error">tel err</div>
        </div>
        <div>
          <input id="cb" type="checkbox" wt-formcheck-type="required" />
          <div id="cbErr" wt-formcheck-type="error">cb err</div>
        </div>
        <button id="submit" wt-formcheck-type="submit" type="button">Send</button>
      </form>
    `;

  const form = document.getElementById('f');
  form.submit = jest.fn();
  InitializeFormCheck();
    const clickSubmit = () => document.getElementById('submit').click();

    // Invalid values
    document.getElementById('em').value = 'not-an-email';
    document.getElementById('num').value = 'abc';
    document.getElementById('tel').value = 'xxx';
    document.getElementById('cb').checked = false;
  clickSubmit();

    expect(document.getElementById('emErr').style.display).toBe('block');
    expect(document.getElementById('numErr').style.display).toBe('block');
    expect(document.getElementById('telErr').style.display).toBe('block');
    expect(document.getElementById('cbErr').style.display).toBe('block');
  expect(form.submit).not.toHaveBeenCalled();

    // Fix values
    document.getElementById('em').value = 'a@b.com';
    document.getElementById('num').value = '42';
    document.getElementById('tel').value = '+1-202-555-0191';
    document.getElementById('cb').checked = true;
    clickSubmit();
    expect(form.submit).toHaveBeenCalled();
  });
});
