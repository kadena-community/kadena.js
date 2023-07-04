import { IPactCommand } from '../interfaces/IPactCommand';
import { quicksign } from '../sign';

const sampleCommand: IPactCommand = {
  payload: {
    code: '(coin.transfer "alice" "bob" 12.1)',
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
    chainId: 'test-chain-id',
    creationTime: 123,
    gasLimit: 400,
    gasPrice: 381,
    sender: 'gas-station',
    ttl: 1000,
  },
};

describe('quicksign', () => {
  it('returns a signed transaction', async () => {
    const result = await quicksign(sampleCommand);
    expect(result).toStrictEqual({
      cmd: JSON.stringify(sampleCommand),
      sigs: ['bob_public_key'],
    });
  });
  it("throws an error if the command doesn't match ICommand interface", async () => {
    await expect(() => quicksign({} as IPactCommand)).rejects.toThrowError(
      new Error('INVALID_COMMAND'),
    );
  });
  it('accepts string as a command', async () => {
    const strCommand = JSON.stringify(sampleCommand);
    const result = await quicksign(strCommand);
    expect(result).toStrictEqual({
      cmd: strCommand,
      sigs: ['bob_public_key'],
    });
  });

  it('adds the signer if the passed as second argd', async () => {
    const strCommand = JSON.stringify(sampleCommand);
    const result = await quicksign(strCommand, {
      alicePublicKey: 'alice_signature',
    });
    expect(result).toStrictEqual({
      cmd: strCommand,
      sigs: ['bob_public_key', 'alice_signature'],
    });
  });
});
