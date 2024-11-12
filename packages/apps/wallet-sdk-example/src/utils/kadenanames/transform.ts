export const addExtentionToName = (name: string): string => {
  const lowerCaseName = name.toLowerCase();
  return lowerCaseName.includes('.') ? name : `${name}.kda`;
};
