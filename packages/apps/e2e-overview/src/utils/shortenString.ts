export const shortenString = (str: string, length: number = 20) => {
  if (str.length <= length) return str;
  return `${str.substr(0, length - 3)}...`;
};
