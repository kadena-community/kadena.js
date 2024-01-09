import { isMarkDownFile } from './../isMarkdownFile';

describe('utils isMarkdown', () => {
  it('should return true if the filename is a markdown file', async () => {
    expect(isMarkDownFile('/he-man/greyskull/masters-of-the-univers.md')).toBe(
      true,
    );
  });
  it('should return true if the filename is a markdownX file', async () => {
    expect(isMarkDownFile('/he-man/greyskull/masters-of-the-univers.mdx')).toBe(
      true,
    );
  });
  it('should return true if the filename is a markdown file', async () => {
    expect(isMarkDownFile('/he-man/greyskull/masters-of-the-univers.tsx')).toBe(
      false,
    );
  });
});
