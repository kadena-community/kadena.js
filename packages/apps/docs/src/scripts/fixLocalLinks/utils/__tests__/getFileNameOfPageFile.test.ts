import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getFileNameOfPageFile } from '../getFileNameOfPageFile';
import { loadConfigPages } from './loadConfigPages.mock';

vi.mock('@/scripts/movePages', () => {
  return {
    loadConfigPages: loadConfigPages,
  };
});

describe('utils getFileNameOfUrl', () => {
  beforeEach(() => {});

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return filePath for this Page', async () => {
    const page = {
      url: '/moderator',
      file: '/contribute/ambassadors/moderator.md',
      id: 'moderator',
    };

    const parentTree = [
      {
        url: '/ambassadors',
        file: '/contribute/ambassadors/index.md',
        id: 'ambassadors',
      },
      {
        url: '/node',
        file: '/contribute/node/index.md',
        id: 'node',
      },
    ];

    const result = getFileNameOfPageFile(page, parentTree);

    expect(result).toStrictEqual('/ambassadors/node/moderator/index.md');
  });
});
