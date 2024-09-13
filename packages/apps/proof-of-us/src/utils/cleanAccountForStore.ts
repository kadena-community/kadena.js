export const cleanAccountForStore = (accountName: string): string => {
  return accountName.replace(/\./g, '');
};
