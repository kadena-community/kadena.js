export const cleanPath = (path: string): string => {
  return path.replace('./public', '').toLowerCase();
};
