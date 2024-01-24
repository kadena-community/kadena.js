import type { ChainId } from '@kadena/client';
import type { IAccount } from '../../../../constants/devnets.js';
import {
  defaultAccount,
  simulationDefaults,
} from '../../../../constants/devnets.js';
import type { TransferType } from '../file.js';
import { appendToLogFile, createFile } from '../file.js';
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
}

export async function simulateCoin({
  network,
  numberOfAccounts,
  transferInterval,
  maxAmount,
  tokenPool,
  logFolder,
  defaultChain,
  seed,
}: ISimulationOptions): Promise<void> {
  const accounts: IAccount[] = [];

  // Parameters validation
  if (tokenPool < maxAmount) {
    console.error(
      'The max transfer amount cant be greater than the total token pool',
    );
    return;
  }

  if (numberOfAccounts <= 1) {
    console.error('Number of accounts must be greater than 1');
    return;
  }

  console.log('Seed value: ', seed);
  const filepath = createFile(logFolder, `coin-${Date.now()}-${seed}.csv`);

  try {
    // Create accounts
    for (let i = 0; i < numberOfAccounts; i++) {
      // This will determine if the account has 1 or 2 keys (even = 1 key, odd = 2 keys)
      const noOfKeys = i % 2 === 0 ? 1 : 2;
      let account = await generateAccount(noOfKeys, defaultChain, network.host);
      console.log(
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

        const balance = await getAccountBalance({
          account: account.account,
          chainId: account.chainId || defaultChain,
          networkHost: network.host,
        });

        // using a random number safety gap to avoid underflowing the account
        const amountWithSafetyGap = amount + getRandomNumber(seededRandomNo, 1);
        if (amountWithSafetyGap > parseFloat(balance)) {
          console.warn(
            `Insufficient funds for ${account.account}\nFunds necessary: ${amountWithSafetyGap}\nFunds available: ${balance}`,
          );
          console.log('Skipping transfer');
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
        if (
          transferType === 'cross-chain-transfer' &&
          simulationDefaults.CHAIN_COUNT > 1
        ) {
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
            console.warn('Skipping cross chain transfer to same chain');
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
            console.warn('Skipping transfer to self');
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
    console.error(error);
    await appendToLogFile(filepath, { error });
    throw error;
  }
}
