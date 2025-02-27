import '@vanilla-extract/css/disableRuntimeStyles';
import { afterEach, vi } from 'vitest';
import 'vitest-dom/extend-expect';

afterEach(() => {});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
