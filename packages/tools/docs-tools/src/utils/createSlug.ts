export const createSlug = (
  str: string,
  parentTitles: string[] = [],
): string => {
  if (str === undefined) return '';

  const normalizedSlug = (parentTitles.join('') + '-' + str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\-\s]+/g, '')
    .replace(/\./g, '') // Remove numbers with dots
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');

  return `${normalizedSlug}`;
};
