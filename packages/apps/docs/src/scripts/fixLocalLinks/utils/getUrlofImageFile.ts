export const getUrlofImageFile = (link: string): string => {
  const cleanLink = link
    .replace(/\.\.\//g, '')
    .replace(/\.\//g, '')
    .replace(/public/, '');

  return cleanLink;
};
