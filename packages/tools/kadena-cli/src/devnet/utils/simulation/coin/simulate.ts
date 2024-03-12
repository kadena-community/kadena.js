import type { ChainId } from '@kadena/client';
import type { IAccount } from '../../../../constants/devnets.js';
import {
  defaultAccount,
  simulationDefaults,
} from '../../../../constants/devnets.js';
import { log } from '../../../../utils/logger.js';
import type { TransferType } from '../file.js';
import { appendToLogFile, createLogFile } from '../file.js';
import {
  generateAccount,
  getAccountBalance,
  getRandomNumber,
  getRandomOption,
  isEqualChainAccounts,
  seedRandom,
  stringifyProperty,
} from '../helper.js';
import { crossChainTransfer } from './crosschain-transfer.js';
import { safeTransfer } from './safe-transfer.js';
import { transfer } from './transfer.js';

const simulationTransferOptions: TransferType[] = [
  'cross-chain-transfer',
  'transfer',
  'safe-transfer',
];

export interface ISimulationOptions {
  network: { host: string; id: string };
  numberOfAccounts: number;
  transferInterval: number;
  maxAmount: number;
  tokenPool: number;
  logFolder: string;
  defaultChain: ChainId;
  seed: string;
  maxTime: number;
}

export async function simulateCoin({
  network,
  numberOfAccounts,
  transferInterval,
  maxAmount,
  tokenPool,
  logFolder,
  seed,
  defaultChain,
  maxTime,
}: ISimulationOptions): Promise<void> {
  const accounts: IAccount[] = [];

  // Parameters validation
  if (tokenPool < maxAmount) {
    log.error(
      'The max transfer amount cant be greater than the total token pool',
    );
    return;
  }

  if (numberOfAccounts <= 1) {
    log.error('Number of accounts must be greater than 1');
    return;
  }

  log.info('Seed value: ', seed);
  const filepath = await createLogFile(
    logFolder,
    `coin-${Date.now()}-${seed}.csv`,
  );

  try {
    // Create accounts
    for (let i = 0; i < numberOfAccounts; i++) {
      // This will determine if the account has 1 or 2 keys (even = 1 key, odd = 2 keys)
      const noOfKeys = i % 2 === 0 ? 1 : 2;
      let account = await generateAccount(noOfKeys, defaultChain, network.host);
      log.info(
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
      const sender: IAccount = { ...defaultAccount, chainId: '0' };

      if (fundingType === 'cross-chain-transfer') {
        account = {
          ...account,
          chainId: '1',
        };

        result = await crossChainTransfer({
          network,
          sender,
          receiver: account,
          amount: tokenPool / numberOfAccounts,
          gasPayer: defaultAccount,
        });
      } else if (fundingType === 'safe-transfer') {
        result = await safeTransfer({
          network,
          chainId: defaultChain,
          receiver: account,
          amount: tokenPool / numberOfAccounts,
          sender,
        });
      } else {
        result = await transfer({
          network,
          receiver: account,
          chainId: defaultChain,
          amount: tokenPool / numberOfAccounts,
          sender,
        });
      }

      // If the account is not in the accountlist, add it
      if (accounts.includes(account)) {
        throw Error('Duplicate account');
      }
      accounts.push(account);

      await appendToLogFile(filepath, {
        timestamp: Date.now(),
        from: defaultAccount.account,
        to: account.account,
        amount: tokenPool / numberOfAccounts,
        requestKey: result.reqKey,
        action: 'fund',
      });
    }

    // Generate first seeded random number
    let seededRandomNo = seedRandom(seed);
    let counter: number = 0;

    const startTime = Date.now();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // Transfer between accounts
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const amount: number = getRandomNumber(seededRandomNo, maxAmount);

        // To avoid underflowing the token pool, we fund an account when there has been more iterations than total amount of circulating tokens divided by max amount
        if (counter >= tokenPool / maxAmount) {
          await transfer({
            network,
            receiver: account,
            chainId: defaultChain,
            amount: tokenPool / numberOfAccounts,
            sender: defaultAccount,
          });
          counter = 0;
        }

        // If not enough balance, continue
        if (
          !(await validateBalance(
            account,
            amount,
            network.host,
            defaultChain,
            seededRandomNo,
          ))
        ) {
          continue;
        }

        // Generate seeded random number based on the previous number
        seededRandomNo = seedRandom(`${seededRandomNo}`);

        // Randomly choose next account
        let nextAccount =
          accounts[getRandomNumber(seededRandomNo, accounts.length)];

        // Random select a transfer type
        const transferType = getRandomOption(
          seededRandomNo,
          simulationTransferOptions,
        );

        let result;

        // This is to simulate cross chain transfers
        if (
          transferType === 'cross-chain-transfer' &&
          simulationDefaults.CHAIN_COUNT > 1
        ) {
          // Make sure the chain id is different
          if (account.chainId === nextAccount.chainId) {
            nextAccount = {
              ...nextAccount,
              chainId: `${getRandomNumber(
                seededRandomNo,
                simulationDefaults.CHAIN_COUNT,
              )}` as ChainId,
            };
          }

          if (account.chainId === nextAccount.chainId) {
            log.warning('Skipping cross chain transfer to same chain');
            continue;
          }

          // Get a random account to potentially pay for the gas
          const possibleGasPayer = getRandomOption(seededRandomNo, accounts);

          result = await crossChainTransfer({
            network,
            sender: account,
            receiver: nextAccount,
            amount,
            gasPayer:
              possibleGasPayer.chainId === nextAccount.chainId
                ? possibleGasPayer
                : defaultAccount,
          });
        } else {
          // Make sure the chain id is the same if the transfer type is transfer or safe-transfer
          if (account.chainId !== nextAccount.chainId) {
            nextAccount = { ...nextAccount, chainId: account.chainId };
          }

          if (isEqualChainAccounts(account, nextAccount)) {
            log.warning('Skipping transfer to self');
            continue;
          }

          // Using a random number to determine if the transfer is a safe transfer or not
          if (transferType === 'transfer') {
            result = await transfer({
              network,
              receiver: nextAccount,
              sender: account,
              amount,
              chainId: account.chainId || defaultChain,
            });
          }
          if (transferType === 'safe-transfer') {
            result = await safeTransfer({
              network,
              receiver: nextAccount,
              sender: account,
              amount,
              chainId: account.chainId || defaultChain,
            });
          }
        }

        await appendToLogFile(filepath, {
          timestamp: Date.now(),
          from: account.account,
          to: nextAccount.account,
          amount,
          requestKey: result?.reqKey ?? '',
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

        const simulatedTime = Date.now() - startTime;

        if (simulatedTime > maxTime) {
          log.info(
            `Simulation stopped after ${maxTime}ms. Please wait for the last transactions to complete.`,
          );
          return;
        }
      }
      counter++;
    }
  } catch (error) {
    log.error(error);
    await appendToLogFile(filepath, { error });
    throw error;
  }
}

async function validateBalance(
  account: IAccount,
  amount: number,
  networkHost: string,
  defaultChain: ChainId,
  seededRandomNo: number,
): Promise<boolean> {
  const balance = await getAccountBalance({
    account: account.account,
    chainId: account.chainId || defaultChain,
    networkHost: networkHost,
  });
  // using a random number safety gap to avoid underflowing the account
  const amountWithSafetyGap = amount + getRandomNumber(seededRandomNo, 1);

  if (amountWithSafetyGap > parseFloat(balance)) {
    log.warning(
      `Insufficient funds for ${account.account}\nFunds necessary: ${amountWithSafetyGap}\nFunds available: ${balance}`,
    );
    log.info('Skipping transfer');
    return false;
  }

  return true;
}
