import type { StreamMetaData } from '@7-docs/edge';

export const removeUnnecessarySearchRecords = (
  arr: Partial<StreamMetaData>[] = [],
): Partial<StreamMetaData>[] => {
  let ids = arr.map((item) => item.title);
  return arr.filter(({ title, score }, index) => {
    const include = ids.includes(title) && score && score > 0.75;
    ids = ids.filter((id) => id !== title);

    return include;
  });
};
