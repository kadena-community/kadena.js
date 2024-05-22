import type { Node } from 'mdast';
import { getCommitId } from './commits';
import { crawlContent } from './crawlContent';
import { getPrId } from './prs';

/**
 * create a version object from the given content markdown
 * with an array of commits and prs
 */
export const createVersionRecord = (content: Node): IChangelogVersionRecord => {
  const contentString = crawlContent(content);

  const { commits, label: tempLabel } = getCommitId(contentString);
  const { prIds, label } = getPrId(tempLabel);

  return {
    label,
    commits,
    prIds,
  };
};
