// Split the account key from the k account details
// e.g. 'k:account-key' -> 'account-key'
const getAccountKey = (account: string): string => account.split(':')[1];

export default getAccountKey;
