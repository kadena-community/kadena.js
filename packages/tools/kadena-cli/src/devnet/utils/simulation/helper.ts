// import type { IAccount } from '@devnet/utils';
import { createPrincipal } from '@kadena/client-utils/built-in';
import { getBalance } from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';
import type { ChainId } from '@kadena/types';
import seedrandom from 'seedrandom';
import type { IAccount } from '../../../constants/devnets.js';
import { simulationDefaults } from '../../../constants/devnets.js';

export const generateAccount = async (
  keys: number = 1,
  chainId: ChainId,
  networkHost: string,
): Promise<IAccount> => {
  const keyPairs = Array.from({ length: keys }, () => genKeyPair());
  const account = await createPrincipal(
    {
      keyset: {
        keys: keyPairs.map((keyPair) => keyPair.publicKey),
      },
    },
    {
      host: networkHost,
      defaults: {
        networkId: simulationDefaults.NETWORK_ID,
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

export const stringifyProperty = <T>(keys: T[], property: keyof T): string => {
  return keys.map((key) => key[property]).join(', ');
};

export const getAccountBalance = async ({
  account,
  chainId,
  networkHost,
}: {
  account: string;
  chainId: ChainId;
  networkHost: string;
}): Promise<string> => {
  const result = await getBalance(
    account,
    simulationDefaults.NETWORK_ID,
    chainId,
    networkHost,
  );

  return result ?? '0';
};
