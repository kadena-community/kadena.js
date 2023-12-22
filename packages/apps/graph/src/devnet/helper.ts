import type {
  ChainId,
  IClient,
  ICommand,
  ICommandResult,
  IKeyPair,
  ITransactionDescriptor,
  IUnsignedCommand,
} from '@kadena/client';
import {
  addSignatures,
  createClient,
  isSignedTransaction,
} from '@kadena/client';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { getBalance } from '@kadena/client-utils/coin';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { dotenv } from '@utils/dotenv';
import { createLogger } from 'graphql-yoga';
import seedrandom from 'seedrandom';

export interface IAccount {
  account: string;
  chainId?: ChainId;
  keys: IKeyPair[];
}

export interface IAccountWithTokens extends IAccount {
  tokens: { [key: string]: number };
}

export const logger = createLogger('info');

const getClient = (): IClient =>
  createClient(
    ({ chainId }) =>
      `${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${chainId}/pact`,
  );

export const submit = (tx: ICommand): Promise<ITransactionDescriptor> =>
  getClient().submit(tx);

export const listen = (tx: ITransactionDescriptor): Promise<ICommandResult> =>
  getClient().listen(tx);

export const signTransaction =
  (keyPairs: IKeyPair[]) =>
  (tx: IUnsignedCommand): IUnsignedCommand | ICommand => {
    const signedTx = keyPairs.reduce((acc, keyPair) => {
      const { sig } = sign(acc.cmd, {
        publicKey: keyPair.publicKey,
        secretKey: keyPair.secretKey,
      });
      if (!sig) throw Error('Failed to sign transaction');
      return addSignatures(acc, { sig, pubKey: keyPair.publicKey });
    }, tx);
    return signedTx;
  };

export const assertTransactionSigned = (
  tx: IUnsignedCommand | ICommand,
): ICommand => {
  const signed = isSignedTransaction(tx);
  if (!signed) throw Error('Failed to sign transaction');
  return tx;
};

export const signAndAssertTransaction =
  (keyPairs: IKeyPair[]) =>
  (tx: IUnsignedCommand): ICommand => {
    const signedTx = signTransaction(keyPairs)(tx);
    const assertedTx = assertTransactionSigned(signedTx);
    return assertedTx;
  };

export const inspect =
  (tag: string): (<T>(data: T) => T) =>
  <T>(data: T): T => {
    logger.info(tag, data);
    return data;
  };

export const generateAccount = async (
  keys: number = 1,
  chainId: ChainId = dotenv.SIMULATE_DEFAULT_CHAIN_ID,
): Promise<IAccount> => {
  const keyPairs = Array.from({ length: keys }, () => genKeyPair());
  const account = await createPrincipal(
    {
      keyset: {
        keys: keyPairs.map((keyPair) => keyPair.publicKey),
      },
    },
    {
      host: dotenv.NETWORK_HOST,
      defaults: {
        networkId: dotenv.NETWORK_ID,
        meta: { chainId },
      },
    },
  );

  return {
    keys: keyPairs,
    account,
    chainId,
  };
};

export const sender00: IAccount = {
  keys: [
    {
      publicKey:
        '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
      secretKey:
        '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
    },
  ],
  account: 'sender00',
};

/** This function takes a random number between 0 and 1 and returns a random number between 0 and maxNumber */
export const getRandomNumber = (
  randomNumber: number,
  maxNumber: number,
  canBeZero: boolean = false,
): number => {
  if (randomNumber > 1 || randomNumber < 0)
    throw new Error('randomNumber must be less than 1 and greater than 0');
  const generatedNumber = Math.floor(randomNumber * maxNumber);

  return generatedNumber === 0
    ? canBeZero
      ? generatedNumber
      : 1
    : generatedNumber;
};

/** This function compares two accounts and checks if they are the same: same account, same public key and same chain id */
export const isEqualChainAccounts = (
  account1: IAccount,
  account2: IAccount,
): boolean => {
  return (
    account1.account === account2.account &&
    account1.chainId === account2.chainId &&
    account1.keys === account2.keys
  );
};

/** This function will seed a random number */
export const seedRandom = (seed: string): number => {
  const random = seedrandom(seed);
  return random();
};

/** This function will receive a random seeded number and return one random option based on the number
 * The same inputs will have the same output
 */
export const getRandomOption = <T>(randomSeed: number, options: T[]): T => {
  if (randomSeed > 1 || randomSeed < 0)
    throw new Error('randomSeed must be less than 1 and greater than 0');

  const gap = 1 / options.length;

  let index = 0;
  let currentGap = gap;

  while (currentGap < randomSeed) {
    index++;
    currentGap += gap;
  }

  return options[index];
};

export const stringifyProperty = <T>(keys: T[], property: keyof T) => {
  return keys.map((key) => key[property]).join(', ');
};

export const getAccountBalance = async ({
  account,
  chainId,
}: {
  account: string;
  chainId: ChainId;
}) => {
  const result = await getBalance(
    account,
    dotenv.NETWORK_ID,
    chainId || dotenv.SIMULATE_DEFAULT_CHAIN_ID,
    dotenv.NETWORK_HOST,
  );

  return result || '0';
};
