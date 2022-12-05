const namespacedAccountRegex: RegExp = new RegExp(/^[a-z]:([a-z0-9]){64}$/g);
const HELP: string =
  "Account names need to follow the recommended convention: 'k:publicKey'";

/**
 * Returns the public key for the provided account name assuming
 * the naming follows the recommended convention: "k:publicKey"
 *
 * @param account - Account name
 * @return Account key
 */
export function accountKey(account: string): string {
  if (!namespacedAccountRegex.test(account)) {
    console.info(HELP);
    process.exit(1);
  }
  return account.split(':')[1];
}
