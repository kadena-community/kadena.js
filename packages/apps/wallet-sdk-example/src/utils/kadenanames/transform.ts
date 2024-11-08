export const addExtentionToName = (name: string): string => {
  return name.includes('.') ? name : `${name}.kda`;
};
