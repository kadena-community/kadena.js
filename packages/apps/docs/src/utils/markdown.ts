import yaml from 'js-yaml';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';
import { frontmatter } from 'micromark-extension-frontmatter';

interface IBranch {
  value: string;
}

export const getFrontMatter = (doc: string): IFrontmatterData => {
  const tree = fromMarkdown(doc.toString(), {
    extensions: [frontmatter()],
    mdastExtensions: [frontmatterFromMarkdown()],
  });
  const value = tree.children[0] as IBranch;

  return yaml.load(value.value);
};
