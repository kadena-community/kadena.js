export const trim = (str: string, term: string): string => {
  let value = str;
  if (value.startsWith(term)) {
    value = value.substring(term.length);
  }
  if (value.endsWith(term)) {
    value = value.substring(0, value.length - term.length);
  }
  return value;
};
