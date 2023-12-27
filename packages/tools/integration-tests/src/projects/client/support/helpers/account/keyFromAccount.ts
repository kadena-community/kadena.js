export type Account = `${'k' | 'w'}:${string}` | string;
export function keyFromAccount(account: Account): string {
  if (!account.includes('k:')) {
    throw new Error(`Not able to retrieve key from '${account}'`);
  }
  return account.split(':')[1];
}
