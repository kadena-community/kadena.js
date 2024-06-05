import yaml from 'js-yaml';
import type { DocsRootContent, IFrontMatterYaml } from './../../types';

export const getFrontMatter = (
  node: DocsRootContent,
): IFrontMatterYaml | undefined => {
  const { type } = node;

  if (type === 'yaml') {
    return yaml.load(node.value) as IFrontMatterYaml;
  }
};
