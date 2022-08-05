import { DateTime } from 'luxon';

let deleteAccounts: any[] = [];

export const deleteAccount = (account: any) => {
  if (
    deleteAccounts &&
    account &&
    !deleteAccounts.some(item => item.accountName === account.accountName)
  ) {
    deleteAccounts.push({
      ...account,
      deletedTime: DateTime.now().toISO(),
    });
  }
};

export const findDeletedAccount = (publicKey: string) => {
  return (
    deleteAccounts.find(
      item => item.publicKey === publicKey || item.accountName === publicKey,
    ) || null
  );
};

export const clearDeletedAccounts = () => {
  deleteAccounts = [];
};
