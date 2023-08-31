const createSlugHash = (str: string): string => {
  let hash = 0;
  // if the length of the string is 0, return 0
  if (str.length === 0) return `${hash}`;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  str.split('').forEach((_char, idx) => {
    const ch = str.charCodeAt(idx);
    hash += ch;
  });
  return `h${hash}`;
};

export const createSlug = (str?: string): string => {
  if (str === undefined) return '';

  let normalizedSlug = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\-\s]+/g, '')
    .replace(/\d+(\.\d+)?./g, '') // Remove numbers with dots
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');

  if (normalizedSlug === '') {
    normalizedSlug = createSlugHash(str);
  }

  return normalizedSlug;
};
