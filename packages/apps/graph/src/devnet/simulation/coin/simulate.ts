import type { IAccount } from '@devnet/utils';
import { sender00 } from '@devnet/utils';
import type { ChainId } from '@kadena/client';
import { dotenv } from '@utils/dotenv';
import { logger } from '@utils/logger';
import type { TransferType } from '../file';
import { appendToFile, createFile } from '../file';
import {
  generateAccount,
  getAccountBalance,
  getRandomNumber,
  getRandomOption,
  isEqualChainAccounts,
  seedRandom,
  stringifyProperty,
} from '../helper';
import { crossChainTransfer } from './crosschain-transfer';
import { safeTransfer } from './safe-transfer';
import { transfer } from './transfer';

const simulationTransferOptions: TransferType[] = [
  'cross-chain-transfer',
  'transfer',
  'safe-transfer',
];

export interface ISimulationOptions {
  numberOfAccounts: number;
  transferInterval: number;
  maxAmount: number;
  tokenPool: number;
  seed: string;
}

export async function simulateCoin({
  numberOfAccounts = 6,
  transferInterval = 100,
  maxAmount = 25,
  tokenPool = 1000000,
  seed = Date.now().toString(),
}: ISimulationOptions): Promise<void> {
  const accounts: IAccount[] = [];

  // Parameters validation
  if (tokenPool < maxAmount) {
    logger.error(
      'The max transfer amount cant be greater than the total token pool',
    );
    return;
  }

  if (numberOfAccounts <= 1) {
    logger.error('Number of accounts must be greater than 1');
    return;
  }

  logger.info('Seed value: ', seed);
  const filepath = createFile(`coin-${Date.now()}-${seed}.csv`);

  try {
    // Create accounts
    for (let i = 0; i < numberOfAccounts; i++) {
      // This will determine if the account has 1 or 2 keys (even = 1 key, odd = 2 keys)
      const noOfKeys = i % 2 === 0 ? 1 : 2;
      let account = await generateAccount(noOfKeys);
      logger.info(
        `Generated KeyPair\nAccount: ${
          account.account
        }\nPublic Key: ${stringifyProperty(
          account.keys,
          'publicKey',
        )}\nSecret Key: ${stringifyProperty(account.keys, 'secretKey')}\n`,
      );

      /* To diversify the initial testing sample, we cycle through all transfer types for the first funding transfers.
      Subsequent transfers will be of the 'transfer' type to simulate normal operations. */
      const fundingType =
        i < simulationTransferOptions.length
          ? simulationTransferOptions[i]
          : 'transfer';

      let result;

      if (fundingType === 'cross-chain-transfer') {
        account = {
          ...account,
          chainId: '1',
        };

        const sender: IAccount = { ...sender00, chainId: '0' };

        result = await crossChainTransfer({
          sender,
          receiver: account,
          amount: tokenPool / numberOfAccounts,
        });
      } else if (fundingType === 'safe-transfer') {
        result = await safeTransfer({
          receiver: account,
          amount: tokenPool / numberOfAccounts,
        });
      } else {
        result = await transfer({
          receiver: account,
          amount: tokenPool / numberOfAccounts,
        });
      }

      // If the account is not in the accountlist, add it
      if (accounts.includes(account)) {
        throw Error('Duplicate account');
      }
      accounts.push(account);

      appendToFile(filepath, {
        timestamp: Date.now(),
        from: 'sender00',
        to: account.account,
        amount: tokenPool / numberOfAccounts,
        requestKey: result.reqKey,
        action: 'fund',
      });
    }

    // Generate first seeded random number
    let seededRandomNo = seedRandom(seed);
    let counter: number = 0;

    while (true) {
      // Transfer between accounts
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const amount: number = getRandomNumber(seededRandomNo, maxAmount);

        // To avoid underflowing the token pool, we fund an account when there has been more iterations than total amount of circulating tokens divided by max amount
        if (counter >= tokenPool / maxAmount) {
          await transfer({
            receiver: account,
            amount: tokenPool / numberOfAccounts,
          });
          counter = 0;
        }

        const balance = await getAccountBalance({
          account: account.account,
          chainId: account.chainId || dotenv.SIMULATE_DEFAULT_CHAIN_ID,
        });

        // using a random number safety gap to avoid underflowing the account
        const amountWithSafetyGap = amount + getRandomNumber(seededRandomNo, 1);
        if (amountWithSafetyGap > parseFloat(balance)) {
          logger.warn(
            `Insufficient funds for ${account.account}\nFunds necessary: ${amountWithSafetyGap}\nFunds available: ${balance}`,
          );
          logger.info('Skipping transfer');
          continue;
        }

        // Generate seeded random number based on the previous number
        seededRandomNo = seedRandom(`${seededRandomNo}`);

        let nextAccount =
          accounts[getRandomNumber(seededRandomNo, accounts.length)];

        // Random select a transfer type
        const transferType = getRandomOption(
          seededRandomNo,
          simulationTransferOptions,
        );

        let result;

        // This is to simulate cross chain transfers
        if (transferType === 'cross-chain-transfer' && dotenv.CHAIN_COUNT > 1) {
          if (account.chainId === nextAccount.chainId) {
            nextAccount = {
              ...nextAccount,
              chainId: `${getRandomNumber(
                seededRandomNo,
                dotenv.CHAIN_COUNT,
              )}` as ChainId,
            };
          }

          if (account.chainId === nextAccount.chainId) {
            logger.warn('Skipping cross chain transfer to same chain');
            continue;
          }

          // Get a random account to potentially pay for the gas
          const possibleGasPayer = getRandomOption(seededRandomNo, accounts);

          result = await crossChainTransfer({
            sender: account,
            receiver: nextAccount,
            amount,
            gasPayer:
              possibleGasPayer.chainId === nextAccount.chainId
                ? possibleGasPayer
                : sender00,
          });
        } else {
          // Make sure the chain id is the same if the transfer type is transfer or safe-transfer
          if (account.chainId !== nextAccount.chainId) {
            nextAccount = { ...nextAccount, chainId: account.chainId };
          }

          if (isEqualChainAccounts(account, nextAccount)) {
            logger.warn('Skipping transfer to self');
            continue;
          }

          // Using a random number to determine if the transfer is a safe transfer or not
          if (transferType === 'transfer') {
            result = await transfer({
              receiver: nextAccount,
              sender: account,
              amount,
              chainId: account.chainId,
            });
          }
          if (transferType === 'safe-transfer') {
            result = await safeTransfer({
              receiver: nextAccount,
              sender: account,
              amount,
              chainId: account.chainId,
            });
          }
        }

        appendToFile(filepath, {
          timestamp: Date.now(),
          from: account.account,
          to: nextAccount.account,
          amount,
          requestKey: result?.reqKey || '',
          action: transferType,
        });

        // If the account is not in the accountlist, add it
        const accountExists = accounts.some((existingAccount) =>
          isEqualChainAccounts(nextAccount, existingAccount),
        );
        if (!accountExists) {
          accounts.push(nextAccount);
        }

        await new Promise((resolve) => setTimeout(resolve, transferInterval));
      }
      counter++;
    }
  } catch (error) {
    logger.error(error);
    appendToFile(filepath, { error: JSON.stringify(error) });
    throw error;
  }
}
