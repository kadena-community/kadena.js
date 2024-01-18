import yaml from 'js-yaml';
import type { IBasePageMeta } from 'src/types';

export const getFrontmatter = async (
  doc: string,
): Promise<IBasePageMeta | undefined> => {
  const { fromMarkdown } = await import('mdast-util-from-markdown');
  const { frontmatterFromMarkdown } = await import('mdast-util-frontmatter');
  const { frontmatter } = await import('micromark-extension-frontmatter');

  const tree = fromMarkdown(doc.toString(), {
    extensions: [frontmatter()],
    mdastExtensions: [frontmatterFromMarkdown()],
  });

  if (!tree.children[0] || tree.children[0].type !== 'yaml') {
    return;
  }

  return yaml.load(tree.children[0].value) as IBasePageMeta;
};

export const getFrontmatterFromTsx = (
  content: string,
): IBasePageMeta | undefined => {
  const regex = /frontmatter\s*:\s*{[^}]+}/;
  const match = content.match(regex);
  if (!match) return;

  const metaString = match[0]
    .replace(/frontmatter:/, '')
    .replace(/(\w+):/g, '"$1":')
    .replace(/'/g, '"')
    .replace(/,(\s*[}\]])/g, '$1');

  const data = JSON.parse(metaString) as IBasePageMeta;
  return data;
};
