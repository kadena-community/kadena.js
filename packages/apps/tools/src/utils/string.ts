export const stripAccountPrefix = (account: string): string => {
  return account.trim().replace(/^k:/i, '');
};
