// Original source: https://github.com/seek-oss/braid-design-system/blob/master/packages/braid-design-system/src/lib/components/Pagination/paginate.ts

export const paginate = ({
  page,
  total,
  maxPages,
}: {
  page: number;
  total: number;
  maxPages: number;
}): number[] => {
  const half = (maxPages - 1) / 2;
  const smallerHalf = Math.floor(half);
  const largerHalf = Math.ceil(half);
  const pageCount = Math.min(maxPages, total);

  let minPage = page - smallerHalf;

  if (page - smallerHalf <= 1) {
    minPage = 1;
  } else if (page + largerHalf >= total) {
    minPage = Math.max(1, total - maxPages + 1);
  }

  return Array.from(Array(pageCount).keys()).map((p) => p + minPage);
};
