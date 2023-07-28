export const createSlug = (
  str?: string,
  index?: number,
  parentTitle = 'menu',
): string => {
  if (str === undefined) return '';

  const normalizedSlug = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\-\s]+/g, '')
    .replace(/\d+(\.\d+)?./g, '') // Remove numbers with dots
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');

  const normalizedParentTitle = parentTitle.toLowerCase().replace(/ /g, '-');

  if (normalizedSlug === '' && index !== undefined)
    return `${normalizedParentTitle}-${index}`;

  if (normalizedSlug === '') return normalizedParentTitle;

  // To check any special character at the end of the string
  const regex = /^.*[!@#$%^&*?]{1}$/;

  if (str.match(regex)) return `${normalizedSlug}-${index}`;

  return normalizedSlug;
};
