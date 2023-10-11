import { createSignWithKeypair } from '@kadena/client';

import {
  createAccount,
  details,
  getBalance,
  transfer,
  transferCreate,
  transferCrossChain,
} from '../coin';

import { withStepFactory } from './support/helpers';
import {
  sender00Account,
  sourceAccount,
  targetAccount,
} from './test-data/accounts';

const accountOne = {
  account: `receiver${Date.now()}`,
  publicKey: sourceAccount.publicKey,
};
const accountTwo = {
  account: `new${Date.now()}`,
  publicKey: targetAccount.publicKey,
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
        host: 'http://localhost:8080',
        defaults: {
          networkId: 'fast-development',
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
          expect(trDesc.networkId).toBe('fast-development');
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
      'fast-development',
      '0',
      'http://localhost:8080',
    );
    expect(balance).toBe(100);
  });
});

describe('getDetails', () => {
  it("should return the account's details", async () => {
    const balance = await details(
      accountOne.account,
      'fast-development',
      '0',
      'http://localhost:8080',
    );
    expect(balance).toEqual({
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
          account: sourceAccount.account,
          publicKeys: [sourceAccount.publicKey],
        },
        chainId: '0',
      },
      {
        host: 'http://localhost:8080',
        defaults: {
          networkId: 'fast-development',
        },
        sign: createSignWithKeypair([sourceAccount]),
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
          account: sourceAccount.account,
          publicKeys: [sourceAccount.publicKey],
        },
        receiver: accountTwo.account,
        amount: '10',
        chainId: '0',
      },
      {
        host: 'http://localhost:8080',
        defaults: {
          networkId: 'fast-development',
        },
        sign: createSignWithKeypair([sourceAccount]),
      },
    ).execute();

    expect(result).toBe('Write succeeded');

    const balance = await getBalance(
      accountTwo.account,
      'fast-development',
      '0',
      'http://localhost:8080',
    );

    expect(balance).toBe(10);
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
        host: 'http://localhost:8080',
        defaults: {
          networkId: 'fast-development',
        },
        sign: createSignWithKeypair([sender00Account]),
      },
    ).execute();

    expect(result).toBe('Write succeeded');

    const balance = await getBalance(
      accountOne.account,
      'fast-development',
      '1',
      'http://localhost:8080',
    );

    expect(balance).toBe(10);
  });
});
