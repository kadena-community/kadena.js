export const addExtentionToName = (name: string): string => {
  const lowerCaseName = name.toLowerCase();
  return lowerCaseName.includes('.') ? name : `${name}.kda`;
};

export const shortenString = (inputString: string): string => {
  if (inputString.length <= 10) {
    return inputString;
  }
  const firstFive = inputString.slice(0, 5);
  const lastFive = inputString.slice(-5);
  return `${firstFive}...${lastFive}`;
};
