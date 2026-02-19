import "@testing-library/jest-dom/vitest";

// Mock crypto.randomUUID for test environments
if (!globalThis.crypto?.randomUUID) {
  let counter = 0;
  Object.defineProperty(globalThis, "crypto", {
    value: {
      ...globalThis.crypto,
      randomUUID: () => `test-uuid-${++counter}`,
    },
  });
}

// Mock localStorage
const store: Record<string, string> = {};
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { for (const key in store) delete store[key]; },
  },
});

// Mock scrollIntoView (not available in jsdom)
Element.prototype.scrollIntoView = () => {};
