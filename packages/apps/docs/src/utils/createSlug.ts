export const createSlug = (str?: string): string => {
  if (str === undefined) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]+/g, '')
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
};
