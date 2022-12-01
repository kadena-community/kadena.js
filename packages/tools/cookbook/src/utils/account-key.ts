// Returns the public key for the provided account name assuming
// the naming follows the recommended convention: "k:publicKey"
export function accountKey(account: string): string {
  return account.split(':')[1];
}
