export const createSlug = (
  str?: string,
  index?: number,
  pageTitle = 'menu',
): string => {
  if (str === undefined) return '';
  const normalizedSlug = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]+/g, '')
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');

  const normalizedPageTitle = pageTitle.toLowerCase().replace(/ /g, '-');

  if (normalizedSlug === '' && index !== undefined)
    return `${normalizedPageTitle}-${index}`;

  if (normalizedSlug === '') return normalizedPageTitle;

  // To check any special character at the end of the string
  const regex = /^.*[!@#$%^&*?]{1}$/;

  if (str.match(regex)) return `${normalizedSlug}-${index}`;

  return normalizedSlug;
};
