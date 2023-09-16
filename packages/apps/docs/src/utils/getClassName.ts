export const getClassName = (str: string): string => {
  return `.${str.split(' ').splice(0, 1)}`;
};
