/**
 * Returns the public key for the provided account name assuming
 * the naming follows the recommended convention: "k:publicKey"
 *
 * @param account - Account name
 * @return Account key
 */
export function accountKey(account: string): string {
  const regExp: RegExp = new RegExp(/^([a-z]+\:)([a-z0-9]{64})$/g);
  const [, namespace, publicKey] = regExp.exec(account) || [];

  if (!namespace || !publicKey) {
    console.info(
      `Account name ${account} doesn't follow the recommended convention: '[a-z]:publicKey'`,
    );
    process.exit(1);
  }

  return publicKey;
}
