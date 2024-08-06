import type { ComponentType } from 'react';
import { Media } from '../media';

describe('layout media', () => {
  it('should return the correct breakpoints', () => {
    assertType<ComponentType<any>>(Media);
  });
});
