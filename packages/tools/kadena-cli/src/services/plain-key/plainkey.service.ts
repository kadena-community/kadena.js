import { kadenaEncrypt, kadenaKeyPairsFromRandom } from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';
import type { IKeyPair as IKeyPairBase } from '@kadena/types';
import { randomBytes } from 'node:crypto';
import { notEmpty } from '../../utils/helpers.js';
import type { IPlainKey, Services } from '../index.js';

type IKeyPair = IKeyPairBase & {
  legacy?: boolean;
};

export interface IPlainKeyService {
  generateKeyPairs: (amount: number, legacy?: boolean) => Promise<IKeyPair[]>;
  list: () => Promise<IPlainKey[]>;
  storeKeyPairs: (
    keyPairs: IKeyPair[],
    alias: string,
  ) => Promise<{ keys: IPlainKey[]; warnings: string[] }>;
}

export class PlainKeyService implements IPlainKeyService {
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/parameter-properties
  public constructor(private services: Services) {}

  public async storeKeyPairs(
    keyPairs: IKeyPair[],
    alias: string,
  ): ReturnType<IPlainKeyService['storeKeyPairs']> {
    const warnings: string[] = [];

    const results = await Promise.all(
      keyPairs.map(async (key, index) => {
        const _alias = keyPairs.length > 1 ? `${alias}-${index}` : alias;
        const store = {
          alias: _alias,
          legacy: key.legacy ?? false,
          publicKey: key.publicKey,
          secretKey: key.secretKey,
        };
        try {
          const filepath = await this.services.config.setPlainKey(store);
          return { ...store, filepath } as IPlainKey;
        } catch (error) {
          if (error instanceof Error) {
            warnings.push(error.message);
            return null;
          }
          throw error;
        }
      }),
    );

    return { keys: results.filter(notEmpty), warnings };
  }

  private async _generateLegacyKeys(amount: number): Promise<IKeyPair[]> {
    const keyPairs: IKeyPair[] = [];
    const password = '';
    const rootKey = await kadenaEncrypt(password, randomBytes(128));

    for (let i = 0; i < amount; i++) {
      const { publicKey, secretKey } = await kadenaGenKeypair(
        password,
        rootKey,
        i,
      );

      keyPairs.push({
        publicKey: publicKey,
        secretKey: secretKey,
        legacy: true,
      });
    }

    return keyPairs;
  }

  public async generateKeyPairs(
    amount: number,
    legacy?: boolean,
  ): ReturnType<IPlainKeyService['generateKeyPairs']> {
    if (legacy === true) {
      return this._generateLegacyKeys(amount);
    }
    return kadenaKeyPairsFromRandom(amount).map((keyPair) => ({
      ...keyPair,
      legacy: false,
    }));
  }

  public list(): ReturnType<IPlainKeyService['list']> {
    return this.services.config.getPlainKeys();
  }
}
