import type { Heading } from 'mdast';

/**
 * creates a new version object
 */
export const createVersion = (branch: Heading): IChangelogPackageVersion => {
  return {
    label: (branch.children[0] as any).value ?? '',
    isLocked: false,
    authors: [],
    patches: [],
    minors: [],
    miscs: [],
  };
};
