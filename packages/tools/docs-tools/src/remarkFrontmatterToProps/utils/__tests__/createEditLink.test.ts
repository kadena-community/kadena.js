import type { IFile } from 'src/types';
import { createEditLink } from '../createEditLink';
import { loadConfigPages as loadConfigPagesMocked } from './../../../mock/loadConfigPages.mock';

vi.mock('./../../../utils/loadConfigPages', () => {
  return {
    loadConfigPages: () => {
      return loadConfigPagesMocked();
    },
  };
});
vi.stubEnv(
  'NEXT_PUBLIC_GIT_EDIT_ROOT',
  'https://github.com/kadena-community/kadena.js/edit/main',
);

describe('createEditLink', () => {
  it('should return the correct edit url', async () => {
    const file: IFile = {
      data: {},
      messages: [],
      history: [
        '/Users/straatemans/Documents/projects/kadena/kadena.js/packages/apps/docs/src/pages/test/index.md',
      ],
      value: '---\n',
    };

    const result = await createEditLink(file);
    expect(result).toBe(
      'https://github.com/kadena-community/kadena.js/edit/main/packages/apps/docs/src/docs/test.md',
    );
  });

  it('should return the correct external repo ', async () => {
    const file: IFile = {
      data: {},
      messages: [],
      history: [
        '/Users/straatemans/Documents/projects/kadena/kadena.js/packages/apps/docs/src/pages/test/build/index.tsx',
      ],
      value: '---\n',
    };

    const result = await createEditLink(file);
    expect(result).toBe(
      'https://github.com/kadena-community/kadena.js/tree/main/index.tsx',
    );
  });
});
