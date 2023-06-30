import { ICommand } from '../../interfaces/ICommand';
import { isCommand } from '../isCommand';

describe('isCommand', () => {
  it('returns false if the object is not a command', () => {
    expect(isCommand({})).toBe(false);
  });

  it('returns true if the object is a command', () => {
    expect(
      isCommand({
        payload: {
          code: '(coin.transfer "alice" "bob" 12.1)',
        },
        signers: [
          {
            pubKey: 'bob_public_key',
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
      } as ICommand),
    ).toBe(true);
  });

  it("returns false if properties of the command object don't match ICommand interface", () => {
    const deleteProperty = <T extends object>(
      obj: T,
      prop: string,
    ): Partial<T> => {
      const parts = prop.split('.');
      if (parts.length > 1) {
        const [first, ...rest] = parts;
        return {
          ...obj,
          [first]: deleteProperty(
            (obj as Record<string, object>)[first],
            rest.join('.'),
          ),
        };
      }
      const newObj = { ...obj } as Record<string, object>;
      delete newObj[prop];
      return newObj as unknown as Partial<T>;
    };
    const command: ICommand = {
      payload: {
        code: '(coin.transfer "alice" "bob" 12.1)',
      },
      signers: [
        {
          pubKey: 'bob_public_key',
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

    expect(isCommand(deleteProperty(command, 'payload'))).toBe(false);
    expect(isCommand(deleteProperty(command, 'payload.code'))).toBe(false);
    expect(isCommand(deleteProperty(command, 'networkId'))).toBe(false);
    expect(isCommand(deleteProperty(command, 'nonce'))).toBe(false);
    expect(isCommand(deleteProperty(command, 'meta'))).toBe(false);
    expect(isCommand(deleteProperty(command, 'meta.chainId'))).toBe(false);
    expect(isCommand(deleteProperty(command, 'meta.creationTime'))).toBe(false);
    expect(isCommand(deleteProperty(command, 'meta.gasLimit'))).toBe(false);
    expect(isCommand(deleteProperty(command, 'meta.gasPrice'))).toBe(false);
    expect(isCommand(deleteProperty(command, 'meta.ttl'))).toBe(false);
  });
});
