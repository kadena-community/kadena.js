export type Account = `${'k' | 'w'}:${string}` | string;
export function keyFromAccount(account: Account): string {
  return account.split(':')[1];
}
