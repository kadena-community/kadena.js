import { IPactCommand } from '../interfaces/IPactCommand';
import { quicksign } from '../sign';

const sampleCommand: IPactCommand = {
  payload: {
    exec: {
      code: '(coin.transfer "alice" "bob" 12.1)',
    },
  },
  signers: [
    {
      clist: [{ args: [], name: 'coin.GAS' }],
      pubKey: 'bob_public_key',
      scheme: 'ED25519',
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

const testTr = {
  cmd: JSON.stringify(sampleCommand),
  hash: 'hash',
  sigs: [{ sig: 'test' }],
};

describe('quicksign', () => {
  it('returns a signed transaction', async () => {
    const result = await quicksign(testTr);
    expect(result).toStrictEqual(testTr);
  });
});
