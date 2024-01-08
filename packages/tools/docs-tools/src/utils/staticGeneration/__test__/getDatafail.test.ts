import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getData } from './../getData';

describe('utils getData throws error', () => {
  beforeEach(() => {
    vi.mock('fs/promises', async () => {
      const actual = (await vi.importActual('fs/promises')) as {};
      return {
        default: {
          ...actual,
          readFile: async (file: string) => {
            return '{]]dffff}';
          },
        },
      };
    });
  });

  afterEach(() => {
    cleanup();
  });
  it('should throw when the data cant be loaded', async () => {
    await expect(() => getData()).rejects.toThrow('Could not load menu data');
  });
});
