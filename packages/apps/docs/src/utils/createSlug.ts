export const createSlug = (str?: string): string => {
  if (str === undefined) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\W_]+/g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');
};
