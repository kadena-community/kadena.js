import type { ChainId } from '@kadena/types';
import { describe, expect, it, vi } from 'vitest';
import { simpleTransferCreateCommand } from '../simpleTransferCreate';

vi.useFakeTimers();

const specificDate = new Date('2023-10-25T12:00:00Z');
vi.setSystemTime(specificDate);

describe('simpleTransferCreateCommand', () => {
  it('should create a transfer command', () => {
    const input = {
      sender: 'k:senderKey',
      receiver: 'k:receiverKey',
      amount: '100',
      chainId: '1' as ChainId,
    };

    const output = simpleTransferCreateCommand(input)();
    expect(output).toEqual({
      payload: {
        exec: {
          code: '(coin.transfer-create "k:senderKey" "k:receiverKey" (read-keyset "account-guard") 100.0)',
          data: {
            'account-guard': {
              keys: ['receiverKey'],
              pred: 'keys-all',
            },
          },
        },
      },
      signers: [
        {
          pubKey: 'senderKey',
          scheme: 'ED25519',
          clist: [
            {
              name: 'coin.TRANSFER',
              args: [
                'k:senderKey',
                'k:receiverKey',
                {
                  decimal: '100',
                },
              ],
            },
            {
              name: 'coin.GAS',
              args: [],
            },
          ],
        },
      ],
      meta: {
        gasLimit: 2500,
        gasPrice: 1e-8,
        sender: 'k:senderKey',
        ttl: 28800,
        creationTime: 1698235200,
        chainId: '1',
      },
      nonce: 'kjs:nonce:1698235200000',
    });
  });

  it('should create a transfer command with public key', () => {
    const input = {
      sender: 'senderKey',
      receiver: 'receiverKey',
      amount: '100',
      chainId: '1' as ChainId,
    };

    const output = simpleTransferCreateCommand(input)();
    expect(output).toEqual({
      payload: {
        exec: {
          code: '(coin.transfer-create "k:senderKey" "k:receiverKey" (read-keyset "account-guard") 100.0)',
          data: {
            'account-guard': {
              keys: ['receiverKey'],
              pred: 'keys-all',
            },
          },
        },
      },
      signers: [
        {
          pubKey: 'senderKey',
          scheme: 'ED25519',
          clist: [
            {
              name: 'coin.TRANSFER',
              args: [
                'k:senderKey',
                'k:receiverKey',
                {
                  decimal: '100',
                },
              ],
            },
            {
              name: 'coin.GAS',
              args: [],
            },
          ],
        },
      ],
      meta: {
        gasLimit: 2500,
        gasPrice: 1e-8,
        sender: 'k:senderKey',
        ttl: 28800,
        creationTime: 1698235200,
        chainId: '1',
      },
      nonce: 'kjs:nonce:1698235200000',
    });
  });

  it('should create a transfer command with custom gasPayer', () => {
    const output = simpleTransferCreateCommand({
      sender: 'k:senderKey',
      receiver: 'k:receiverKey',
      amount: '100',
      chainId: '1' as ChainId,
      gasPayer: {
        account: 'k:gasPayerKey',
        publicKeys: ['gasPayerKey'],
      },
    })();
    expect(output).toEqual({
      payload: {
        exec: {
          code: '(coin.transfer-create "k:senderKey" "k:receiverKey" (read-keyset "account-guard") 100.0)',
          data: {
            'account-guard': {
              keys: ['receiverKey'],
              pred: 'keys-all',
            },
          },
        },
      },
      signers: [
        {
          pubKey: 'senderKey',
          scheme: 'ED25519',
          clist: [
            {
              name: 'coin.TRANSFER',
              args: [
                'k:senderKey',
                'k:receiverKey',
                {
                  decimal: '100',
                },
              ],
            },
          ],
        },
        {
          pubKey: 'gasPayerKey',
          scheme: 'ED25519',
          clist: [
            {
              name: 'coin.GAS',
              args: [],
            },
          ],
        },
      ],
      meta: {
        gasLimit: 2500,
        gasPrice: 1e-8,
        sender: 'k:gasPayerKey',
        ttl: 28800,
        creationTime: 1698235200,
        chainId: '1',
      },
      nonce: 'kjs:nonce:1698235200000',
    });
  });
});
