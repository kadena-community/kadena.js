export const createSlugHash = (str: string): string => {
  let hash = 0;
  // if the length of the string is 0, return 0
  if (str.length === 0) return ``;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  str.split('').forEach((_char, idx) => {
    const ch = str.charCodeAt(idx);
    hash = (hash << 5) - hash + ch;
    // eslint-disable-next-line no-bitwise
    hash = hash & hash;
  });
  return `h${hash}`;
};

export const createSlug = (str: string): string => {
  if (str === undefined) return '';

  const normalizedSlug = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\-\s]+/g, '')
    .replace(/\./g, '') // Remove numbers with dots
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');

  return `${normalizedSlug}${createSlugHash(str)}`;
};
