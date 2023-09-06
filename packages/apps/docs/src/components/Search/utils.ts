import type { StreamMetaData } from '@7-docs/edge';

export const removeUnnecessarySearchRecords = (
  arr: Partial<StreamMetaData>[] = [],
): Partial<StreamMetaData>[] => {
  const ids = arr.map((item) => item.title);
  return arr.filter(
    ({ title, score }, index) =>
      !ids.includes(title, index + 1) && score && score > 0.75,
  );
};
