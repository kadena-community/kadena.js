import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';
import 'vitest-dom/extend-expect';
import { getConfig } from './src/mock/getConfig.mock';

beforeAll(() => {
  vi.mock('./src/utils/getConfig', () => {
    return {
      getConfig: getConfig,
    };
  });
});

afterEach(() => {
  cleanup();
});

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
