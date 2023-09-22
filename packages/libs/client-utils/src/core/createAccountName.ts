import { hash } from '@kadena/cryptography-utils';

export type Account = `${'k' | 'w'}:${string}` | string;

export function createAccountName(key: string): Account;
export function createAccountName(
  keys: string[],
  predicate?: 'keys-all' | 'keys-one' | 'keys-two' | string,
): Account;
export function createAccountName(
  keyOrKeys: string | string[],
  predicate?: 'keys-all' | 'keys-one' | 'keys-two' | string,
): Account {
  if (typeof keyOrKeys === 'string') return `k:${keyOrKeys}`;
  const keys = keyOrKeys;
  return `${hash(keys.join(''))}:${predicate}`;
}
