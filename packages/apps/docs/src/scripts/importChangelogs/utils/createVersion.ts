import type { Heading } from 'mdast';
import { cleanVersionLabel } from './cleanVersionLabel';

/**
 * creates a new version object
 */
export const createVersion = (branch: Heading): IChangelogPackageVersion => {
  return {
    label: cleanVersionLabel((branch.children[0] as any).value ?? ''),
    description: '',
    descriptionTemp: {
      type: 'root',
      children: [],
    },
    isLocked: false,
    authors: [],
    patches: [],
    minors: [],
    miscs: [],
  };
};
