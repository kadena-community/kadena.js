import { IPactCommand } from '../../interfaces/IPactCommand';
import { Pact } from '../../pact';
import { createTransaction } from '../createTransaction';
import { literal } from '../pact-helpers';

const pactCommand: IPactCommand = {
  payload: {
    exec: {
      code: '(coin.transfer "alice" "bob" 12.1)',
    },
  },
  signers: [
    {
      pubKey: 'bob_public_key',
      clist: [{ args: [], name: 'coin.GAS' }],
    },
  ],
  networkId: 'test-network-id',
  nonce: 'test-nonce',
  meta: {
    chainId: '1',
    creationTime: 123,
    gasLimit: 400,
    gasPrice: 381,
    sender: 'gas-station',
    ttl: 1000,
  },
};

describe('createTransaction', () => {
  it('returns a transaction object with the correct hash', () => {
    const transaction = createTransaction(pactCommand);

    expect(transaction.hash).toBe(
      'fo-INzZ1jYEYILEavqawvkBmGld6DajK7ozxGZF8knM',
    );
  });

  it('returns a transaction object with the correct cmd', () => {
    const transaction = createTransaction(pactCommand);

    expect(transaction.cmd).toBe(JSON.stringify(pactCommand));
  });

  it('returns a transaction object with the sigs array the same length as signers array', () => {
    const transaction = createTransaction(pactCommand);

    expect(transaction.sigs).toHaveLength(1);
    expect(transaction.sigs).toStrictEqual([undefined]);
  });
  it('returns a transaction object with empty sigs array if there is no signers in the pactCommand', () => {
    const { signers, ...command } = pactCommand;

    expect(signers).toBeDefined();

    const transaction = createTransaction(command);

    expect(transaction.sigs).toHaveLength(0);
  });
  it('adds Literal values without quote to the output', () => {
    const command = Pact.builder
      .execution(
        (Pact.modules as any).test['test-fun'](
          'bob',
          'alice',
          literal('guard'),
          { test: { modules: [literal('coin'), literal('free.coin')] } },
          { decimal: '12.0' },
        ),
      )
      .setNonce('nonce:1')
      .createTransaction();
    expect(command).toEqual({
      cmd: '{"payload":{"exec":{"code":"(test.test-fun \\"bob\\" \\"alice\\" guard {\\"test\\":{\\"modules\\":[coin,free.coin]}} 12.0)","data":{}}},"nonce":"nonce:1","signers":[]}',
      hash: 'Xm1CjhIcGSO7wUxKiLZxyuFi_DuOexD0eq44QW_BRjI',
      sigs: [],
    });
  });
});
