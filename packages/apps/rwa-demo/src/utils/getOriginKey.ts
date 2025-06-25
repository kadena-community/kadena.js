//this will take an origin URL and return a normalized key,
//so it can be used as a key in a map or object
//eg: https://example.com -> httpsexamplecom
export const getOriginKey = (origin?: string | null) => {
  if (!origin) return;
  let normalized = origin.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  normalized = normalized.replace(/[^a-zA-Z0-9 ]/g, '');
  return normalized;
};
