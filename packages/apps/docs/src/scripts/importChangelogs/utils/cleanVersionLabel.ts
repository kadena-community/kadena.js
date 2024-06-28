export const cleanVersionLabel = (label: string): string => {
  return label.replace(/\([^()]*\)/g, '').trim();
};
