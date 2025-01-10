export const setAliasesToAccounts = (
  accounts: any[],
  aliases: any[],
): any[] => {
  return accounts.map((account) => {
    const alias = aliases.find(
      ({ accountName }) => accountName === account.accountName,
    );
    if (!alias) return account;

    return { ...account, alias: alias.alias };
  });
};
