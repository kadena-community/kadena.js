export const safeJsonParse = (string: string): any => {
  try {
    return JSON.parse(string);
  } catch (e) {
    return string;
  }
};
