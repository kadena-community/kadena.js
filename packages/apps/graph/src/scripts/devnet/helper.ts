import type {
  ChainId,
  IClient,
  ICommand,
  ICommandResult,
  IPollRequestPromise,
  ITransactionDescriptor,
  IUnsignedCommand,
} from '@kadena/client';
import {
  addSignatures,
  createClient,
  isSignedTransaction,
} from '@kadena/client';
import { genKeyPair, sign } from '@kadena/cryptography-utils';
import { createLogger } from 'graphql-yoga';
import seedrandom from 'seedrandom';
import { devnetConfig } from './config';

export interface IAccount extends IKeyPair {
  account: string;
  chainId?: ChainId;
}

export interface IKeyPair {
  publicKey: string;
  secretKey?: string;
}

export const logger = createLogger('info');

const getClient = (): IClient =>
  createClient(
    ({ chainId, networkId }) =>
      `http://localhost:${devnetConfig.PORT}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  );

export const submit = (tx: ICommand): Promise<ITransactionDescriptor> =>
  getClient().submit(tx);

export const listen = (tx: ITransactionDescriptor): Promise<ICommandResult> =>
  getClient().listen(tx);

export const pollCreateSpv = (
  tx: ITransactionDescriptor,
  chainId: ChainId,
): Promise<string> => getClient().pollCreateSpv(tx, chainId);

export const pollStatus = (
  tx: ITransactionDescriptor,
): IPollRequestPromise<ICommandResult> => getClient().pollStatus(tx);

export const dirtyRead = (tx: IUnsignedCommand): Promise<ICommandResult> =>
  getClient().dirtyRead(tx);

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

export const asyncPipe =
  (...fns: any[]) =>
  (value: any) => {
    return fns.reduce((acc, fn) => acc.then(fn), Promise.resolve(value));
  };

export const generateKeyPair = (
  chainId: ChainId = devnetConfig.CHAIN_ID,
): IAccount => {
  const generatedKeyPair = genKeyPair();

  return {
    publicKey: generatedKeyPair.publicKey,
    secretKey: generatedKeyPair.secretKey || '',
    account: `k:${generatedKeyPair.publicKey}`,
    chainId: chainId,
  };
};

export const sender00: IAccount = {
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
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
    account1.publicKey === account2.publicKey
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
