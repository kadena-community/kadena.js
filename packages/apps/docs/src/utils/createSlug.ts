export const createSlug = (str?: string, index?: number): string => {
  if (str === undefined) return '';
  const normalizedSlug = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]+/g, '')
    .replace(/ /g, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '');

  if (normalizedSlug === '' && index !== undefined) return `operator-${index}`;

  if (index === undefined) return normalizedSlug;

  return `${normalizedSlug}-${index}`;
};
