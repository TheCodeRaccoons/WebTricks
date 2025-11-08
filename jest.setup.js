// Global Jest setup

// Increase per-test timeout (can be overridden in individual tests)
jest.setTimeout(20000);

// Ensure real timers after each test to avoid lingering fake timers
afterEach(() => {
  try { jest.useRealTimers(); } catch {}
});

// Polyfill requestAnimationFrame/cancelAnimationFrame for jsdom
global.requestAnimationFrame = global.requestAnimationFrame || (cb => setTimeout(cb, 0));
global.cancelAnimationFrame = global.cancelAnimationFrame || (id => clearTimeout(id));
