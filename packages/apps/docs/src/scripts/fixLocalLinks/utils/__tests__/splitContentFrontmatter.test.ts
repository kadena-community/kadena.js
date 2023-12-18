import { describe, expect, it } from 'vitest';
import { splitContentFrontmatter } from '../splitContentFrontmatter';

describe('utils splitContentFrontmatter', () => {
  it('should return an object with the frontmatter content and the actual content', async () => {
    const markdown = `---
    title: Test2
    description: Common use cases for
    menu: Test2
    label: Test2
    layout: full
    tags: [pact, typescript, account, transactions, utils]
---
# Test2
sdfs
`;

    const expectedResult = {
      frontmatter: `
    title: Test2
    description: Common use cases for
    menu: Test2
    label: Test2
    layout: full
    tags: [pact, typescript, account, transactions, utils]
`,
      content: `# Test2
sdfs`,
    };

    expect(splitContentFrontmatter(markdown)).toEqual(expectedResult);
  });
});
