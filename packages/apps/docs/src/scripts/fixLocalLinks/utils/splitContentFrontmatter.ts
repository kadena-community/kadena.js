// splits the file markdown content from the frontmatter.
// the frontmatter of the mark is split by "---"
export const splitContentFrontmatter = (
  content: string,
): { frontmatter: string | null; content: string } => {
  const frontmatterRegex = /^---([\s\S]+?)---/;
  const frontmatterMatch = content.match(frontmatterRegex);

  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : null;
  const contentWithoutFrontmatter = frontmatter
    ? content.replace(frontmatterRegex, '').trim()
    : content.trim();

  return {
    content: contentWithoutFrontmatter,
    frontmatter: frontmatter,
  };
};
