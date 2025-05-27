export const getOriginKey = (origin?: string | null) => {
  if (!origin) return;
  let normalized = origin.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  normalized = normalized.replace(/[^a-zA-Z0-9 ]/g, '');
  return normalized;
};
