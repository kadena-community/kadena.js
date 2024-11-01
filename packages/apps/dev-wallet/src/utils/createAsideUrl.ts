export const createAsideUrl = (
  key: string,
  data?: Record<string, string>,
): string => {
  const innerData = data ?? {};
  const str = `#aside=${key}&q=${Math.random()}`;
  return Object.entries(innerData).reduce((acc, val) => {
    return `${acc}&${val[0]}=${val[1]}`;
  }, str);
};
