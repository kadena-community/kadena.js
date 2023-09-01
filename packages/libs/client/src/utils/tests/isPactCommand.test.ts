import { type IPactCommand } from '../../interfaces/IPactCommand';
import { isPactCommand } from '../isPactCommand';

describe('isCommand', () => {
  it('returns false if the object is not a command', () => {
    expect(isPactCommand({})).toBe(false);
  });

  it('returns true if the object is a command', () => {
    expect(
      isPactCommand({
        payload: {
          exec: {
            code: '(coin.transfer "alice" "bob" 12.1)',
          },
        },
        signers: [
          {
            pubKey: 'bob_public_key',
          },
        ],
        networkId: 'test-network-id',
        nonce: 'test-nonce',
        meta: {
          chainId: '0',
          creationTime: 123,
          gasLimit: 400,
          gasPrice: 381,
          sender: 'gas-station',
          ttl: 1000,
        },
      } as IPactCommand),
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
    const command: IPactCommand = {
      payload: {
        exec: {
          code: '(coin.transfer "alice" "bob" 12.1)',
        },
      },
      signers: [
        {
          pubKey: 'bob_public_key',
        },
      ],
      networkId: 'test-network-id',
      nonce: 'test-nonce',
      meta: {
        chainId: '0',
        creationTime: 123,
        gasLimit: 400,
        gasPrice: 381,
        sender: 'gas-station',
        ttl: 1000,
      },
    };

    expect(isPactCommand(deleteProperty(command, 'payload'))).toBe(false);
    expect(isPactCommand(deleteProperty(command, 'payload.exec'))).toBe(false);
    expect(isPactCommand(deleteProperty(command, 'networkId'))).toBe(false);
    expect(isPactCommand(deleteProperty(command, 'nonce'))).toBe(false);
    expect(isPactCommand(deleteProperty(command, 'meta'))).toBe(false);
    expect(isPactCommand(deleteProperty(command, 'meta.chainId'))).toBe(false);
    expect(isPactCommand(deleteProperty(command, 'meta.creationTime'))).toBe(
      false,
    );
    expect(isPactCommand(deleteProperty(command, 'meta.gasLimit'))).toBe(false);
    expect(isPactCommand(deleteProperty(command, 'meta.gasPrice'))).toBe(false);
    expect(isPactCommand(deleteProperty(command, 'meta.ttl'))).toBe(false);
  });
});
