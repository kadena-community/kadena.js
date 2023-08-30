import { StreamMetaData } from '@7-docs/edge';

export const removeDuplicateSearchRecords = (
  arr: Partial<StreamMetaData>[] = [],
): Partial<StreamMetaData>[] => {
  const ids = arr.map((item) => item.title);
  return arr.filter(({ title }, index) => !ids.includes(title, index + 1));
};
