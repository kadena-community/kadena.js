import { cleanup } from '@testing-library/react';
import '@vanilla-extract/css/disableRuntimeStyles';
import { afterEach, beforeAll, vi } from 'vitest';
import 'vitest-dom/extend-expect';

beforeAll(() => {
  vi.mock('next/router', () => import('next-router-mock'));
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