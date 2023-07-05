import { IPactCommand } from '../../interfaces/IPactCommand';
import { createTransaction } from '../createTransaction';

const pactCommand: IPactCommand = {
  payload: {
    code: '(coin.transfer "alice" "bob" 12.1)',
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
    chainId: 'test-chain-id',
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
      '8GTxDPc0F4RG-j4ZgfJA97HvVXHy5Z1sOzAhwWbukAs',
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
});
