import { isAlreadyIgnored } from '../';

describe('utils isAlreadyIgnored', () => {
  it('should return true if the filepath is in the content', async () => {
    const filepath = '/contribute/ambassadors/index.md';
    const content = `
## added by scripts
/contribute/index.tsx
/contribute/docs/index.md
/contribute/kadena-dao/index.md
/contribute/ambassadors/index.md
/contribute/ambassadors/moderator/index.md
/contribute/ambassadors/content-creator/index.md
    `;

    expect(isAlreadyIgnored(filepath, content)).toEqual(true);
  });

  it('should return false if the filepath is NOT in the content', async () => {
    const filepath = '/contribute/ambassadors/index.md';
    const content = `
## added by scripts
/contribute/index.tsx
/contribute/docs/index.md
/contribute/kadena-dao/index.md
/contribute/ambassadors/moderator/index.md
/contribute/ambassadors/content-creator/index.md
    `;

    expect(isAlreadyIgnored(filepath, content)).toEqual(false);
  });
});
