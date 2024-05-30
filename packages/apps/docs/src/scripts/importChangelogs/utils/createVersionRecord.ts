import type { Node } from 'mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import type { Root } from 'remark-gfm';
import { getCommitId } from './commits';
import { getPrId } from './prs';

/**
 * create a version object from the given content markdown
 * with an array of commits and prs
 */
export const createVersionRecord = (content: Node): IChangelogVersionRecord => {
  content.type = 'root';
  const contentString = toMarkdown(content as Root);

  const { commits, label: tempLabel } = getCommitId(contentString);
  const { prIds, label } = getPrId(tempLabel);

  return {
    label,
    commits,
    prIds,
  };
};
