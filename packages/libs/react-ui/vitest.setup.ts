import { cleanup } from '@testing-library/react';
import '@vanilla-extract/css/disableRuntimeStyles';
import { afterEach, beforeAll, vi } from 'vitest';
import 'vitest-dom/extend-expect';

afterEach(() => {
  cleanup();
});
