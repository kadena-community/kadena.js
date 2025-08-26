import type {
  Guard,
  IWalletAccount,
} from '@/providers/AccountProvider/AccountType';
import { describe, expect, it } from 'vitest';
import { setSigner } from '../setSigner';

// Minimal mock Guard
const mockGuard: Guard = { keys: ['abc'], pred: 'keys-all' } as Guard;

const baseAccount: IWalletAccount = {
  address: 'k:abc',
  publicKey: 'testPublicKey',
  guard: mockGuard,
  keyset: mockGuard,
  alias: 'alias',
  contract: 'contract',
  chains: [{ chainId: '0', balance: '0' }],
  overallBalance: '0',
  walletName: 'CHAINWEAVER',
  walletType: 'default',
};

describe('setSigner', () => {
  it('returns the publicKey for non-WebAuthn walletType', () => {
    const account = {
      ...baseAccount,
      walletType: 'default',
    } satisfies IWalletAccount;
    expect(setSigner(account)).toBe('testPublicKey');
  });

  it('returns an object with pubKey and scheme for WebAuthn walletType', () => {
    const account = {
      ...baseAccount,
      walletType: 'WebAuthn',
    } satisfies IWalletAccount;
    expect(setSigner(account)).toEqual({
      pubKey: 'testPublicKey',
      scheme: 'WebAuthn',
    });
  });
});
