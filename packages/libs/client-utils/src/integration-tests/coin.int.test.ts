import type { IExecutionPayloadObject, IPactCommand } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { describe, expect, it } from 'vitest';

import {
  createAccount,
  details,
  getBalance,
  transfer,
  transferCreate,
  transferCrossChain,
} from '../coin';

import { safeTransfer } from '../coin/safe-transfer';
import { NetworkIds } from './support/NetworkIds';
import { withStepFactory } from './support/helpers';
import {
  sender00Account,
  sourceAccount,
  targetAccount,
} from './test-data/accounts';

const accountOne = {
  ...sourceAccount,
  account: `one-${Date.now()}`,
};
const accountTwo = {
  ...targetAccount,
  account: `two-${Date.now()}`,
};

describe('transferCreate', () => {
  it('should transfer kda from sender00 account to receiverAccount and create the account if its not exist', async () => {
    const withStep = withStepFactory();
    const result = await transferCreate(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: accountOne.account,
          keyset: {
            keys: [accountOne.publicKey],
            pred: 'keys-all',
          },
        },
        amount: '100',
        chainId: '0',
      },
      {
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([sender00Account]),
      },
    )
      .on(
        'sign',
        withStep((step, tx) => {
          expect(step).toBe(1);
          expect(tx.sigs).toHaveLength(1);
          expect(tx.sigs[0].sig).toBeTruthy();
        }),
      )
      .on(
        'preflight',
        withStep((step, prResult) => {
          expect(step).toBe(2);
          if (prResult.result.status === 'failure') {
            expect(prResult.result.status).toBe('success');
          } else {
            expect(prResult.result.data).toBe('Write succeeded');
          }
        }),
      )
      .on(
        'submit',
        withStep((step, trDesc) => {
          expect(step).toBe(3);
          expect(trDesc.networkId).toBe(NetworkIds.development);
          expect(trDesc.chainId).toBe('0');
          expect(trDesc.requestKey).toBeTruthy();
        }),
      )
      .on(
        'listen',
        withStep((step, sbResult) => {
          expect(step).toBe(4);
          if (sbResult.result.status === 'failure') {
            expect(sbResult.result.status).toBe('success');
          } else {
            expect(sbResult.result.data).toBe('Write succeeded');
          }
        }),
      )
      .execute();

    expect(result).toBe('Write succeeded');
  });
});

describe('getBalance', () => {
  it("should return the account's balance", async () => {
    const balance = await getBalance(
      accountOne.account,
      'development',
      '0',
      'http://127.0.0.1:8080',
    );
    expect(balance).toBe('100');
  });
});

describe('getDetails', () => {
  it("should return the account's details", async () => {
    const data = await details(
      accountOne.account,
      'development',
      '0',
      'http://127.0.0.1:8080',
    );
    expect(data).toEqual({
      account: accountOne.account,
      balance: 100,
      guard: {
        keys: [accountOne.publicKey],
        pred: 'keys-all',
      },
    });
  });
});

describe('createAccount', () => {
  it("should create the account with 0 balance if it's not exist", async () => {
    const result = await createAccount(
      {
        account: accountTwo.account,
        keyset: {
          keys: [accountTwo.publicKey],
          pred: 'keys-all',
        },
        gasPayer: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        chainId: '0',
      },
      {
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([sender00Account]),
      },
    ).execute();

    expect(result).toBe('Write succeeded');
  });
});

describe('transfer', () => {
  it('should transfer amount to an existed account', async () => {
    const result = await transfer(
      {
        sender: {
          account: accountOne.account,
          publicKeys: [accountOne.publicKey],
        },
        receiver: accountTwo.account,
        amount: '10',
        chainId: '0',
      },
      {
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([accountOne]),
      },
    ).execute();

    expect(result).toBe('Write succeeded');

    const balance = await getBalance(
      accountTwo.account,
      'development',
      '0',
      'http://127.0.0.1:8080',
    );

    expect(balance).toBe('10');
  });
});

describe('cross chain transfer', () => {
  it('should transfer amount to another chain', async () => {
    const result = await transferCrossChain(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: accountOne.account,
          keyset: {
            keys: [accountOne.publicKey],
            pred: 'keys-all',
          },
        },
        amount: '10',
        chainId: '0',
        targetChainId: '1',
      },
      {
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([sender00Account]),
      },
    ).execute();

    expect(result).toBe('Write succeeded');

    const balance = await getBalance(
      accountOne.account,
      'development',
      '1',
      'http://127.0.0.1:8080',
    );

    expect(balance).toBe('10');
  });
});

describe('safeTransfer', () => {
  it('should transfer kda from sender00 account to receiverAccount if both receiver and sender sign', async () => {
    const initialBalance = await getBalance(
      accountOne.account,
      'development',
      '0',
      'http://127.0.0.1:8080',
    );
    const result = await safeTransfer(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: accountOne.account,
          publicKeys: [accountOne.publicKey],
        },
        amount: '10',
        chainId: '0',
      },
      {
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([sender00Account, accountOne]),
      },
    )
      .on('sign', (tx) => {
        expect(tx.sigs).toHaveLength(2);
        expect(tx.sigs[0].sig).toBeTruthy();
        expect(tx.sigs[1].sig).toBeTruthy();
      })
      .execute();

    expect(result).toBe('Write succeeded');

    const balanceAfterTransfer = await getBalance(
      accountOne.account,
      'development',
      '0',
      'http://127.0.0.1:8080',
    );
    if (
      typeof balanceAfterTransfer === 'string' &&
      typeof initialBalance === 'string'
    ) {
      expect(+balanceAfterTransfer).toBe(+initialBalance + 10);
    } else {
      throw new Error('balance is not a number');
    }
  });

  it('should fail if receiver does not sign', async () => {
    const task = safeTransfer(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: accountOne.account,
          publicKeys: [accountOne.publicKey],
        },
        amount: '100',
        chainId: '0',
      },
      {
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([sender00Account]),
      },
    );

    await expect(() => task.execute()).rejects.toThrowError(
      new Error('Signing failed'),
    );
  });

  it('should fail if receiver does not satisfy the account guard sign', async () => {
    const task = safeTransfer(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: accountOne.account,
          publicKeys: [sender00Account.publicKey],
        },
        amount: '100',
        chainId: '0',
      },
      {
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([sender00Account]),
      },
    );

    await expect(() => task.execute()).rejects.toThrow(/Keyset failure/);
  });

  it('uses normal transfer if gasPayer is the same as receiver', async () => {
    const initialBalance = await getBalance(
      accountOne.account,
      'development',
      '0',
      'http://127.0.0.1:8080',
    );
    const result = await safeTransfer(
      {
        sender: {
          account: sender00Account.account,
          publicKeys: [sender00Account.publicKey],
        },
        receiver: {
          account: accountOne.account,
          publicKeys: [accountOne.publicKey],
        },
        gasPayer: {
          account: accountOne.account,
          publicKeys: [accountOne.publicKey],
        },
        amount: '10',
        chainId: '0',
      },
      {
        host: 'http://127.0.0.1:8080',
        defaults: {
          networkId: 'development',
        },
        sign: createSignWithKeypair([sender00Account, accountOne]),
      },
    )
      .on('sign', (tx) => {
        const command: IPactCommand = JSON.parse(tx.cmd);
        expect(
          (command.payload as IExecutionPayloadObject).exec.code.split(
            'coin.transfer',
          ),
        ).toHaveLength(2);
      })
      .execute();

    expect(result).toBe('Write succeeded');
    const balanceAfterTransfer = await getBalance(
      accountOne.account,
      'development',
      '0',
      'http://127.0.0.1:8080',
    );
    if (
      typeof balanceAfterTransfer === 'string' &&
      typeof initialBalance === 'string'
    ) {
      // since we are using the same account as gasPayer, we expect the balance to be 10 less
      expect(+balanceAfterTransfer > +initialBalance + 9).toBeTruthy();
      expect(+balanceAfterTransfer < +initialBalance + 10).toBeTruthy();
    } else {
      throw new Error('balance is not a number');
    }
  });
});
