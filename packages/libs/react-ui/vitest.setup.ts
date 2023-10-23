import { cleanup } from '@testing-library/react';
import '@vanilla-extract/css/disableRuntimeStyles';
import { afterEach } from 'vitest';
import 'vitest-dom/extend-expect';

afterEach(() => {
  cleanup();
});
