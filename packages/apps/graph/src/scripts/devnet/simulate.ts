import type { ChainId } from '@kadena/client';
import { devnetConfig } from './config';
import { crossChainTransfer } from './crosschain-transfer';
import type { TransferType } from './file';
import { appendToFile, createFile } from './file';
import { getBalance } from './get-balance';
import type { IAccount } from './helper';
import {
  generateKeyPair,
  getRandomNumber,
  getRandomOption,
  isEqualChainAccounts,
  logger,
  seedRandom,
} from './helper';
import { safeTransfer } from './safe-transfer';
import { transfer } from './transfer';

const simualtionTransferOptions: TransferType[] = [
  'xchaintransfer',
  'transfer',
  'safe-transfer',
];

export async function simulate({
  numberOfAccounts = 2,
  transferInterval = 1000,
  maxAmount = 25,
  tokenPool = 1000000,
  seed = Date.now().toString(),
}: {
  numberOfAccounts: number;
  transferInterval: number;
  maxAmount: number;
  tokenPool: number;
  seed: string;
}): Promise<void> {
  const accounts: IAccount[] = [];

  if (tokenPool < maxAmount || numberOfAccounts < 0) {
    logger.info('Invalid parameters');
    return;
  }

  logger.info('Seed value: ', seed);
  const filepath = createFile(`${Date.now()}-${seed}.csv`);

  // Create accounts
  for (let i = 0; i < numberOfAccounts; i++) {
    const account = generateKeyPair();
    logger.info(
      `Generated KeyPair\nAccount: ${account.account}\nPublic Key: ${account.publicKey}\nSecret Key: ${account.secretKey}\n`,
    );

    if (accounts.includes(account)) {
      throw Error('Duplicate account');
    }
    accounts.push(account);

    // Fund account
    const result = await transfer({
      publicKey: account.publicKey,
      amount: tokenPool / numberOfAccounts,
    });

    appendToFile(filepath, {
      timestamp: Date.now(),
      from: 'sender00',
      to: account.account,
      amount: tokenPool / numberOfAccounts,
      requestKey: result.reqKey,
      type: 'fund',
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
          publicKey: account.publicKey,
          amount: tokenPool / numberOfAccounts,
        });
        counter = 0;
      }

      const balance = (await getBalance(account)) as number;

      // using a random number safety gap to avoid underflowing the account
      if (amount + getRandomNumber(seededRandomNo, 1) > balance) {
        logger.info(
          `Insufficient funds for ${account.account}\nFunds necessary: ${amount}\nFunds available: ${balance}`,
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
        simualtionTransferOptions,
      );

      let result;

      // This is to simulate cross chain transfers
      if (transferType === 'xchaintransfer') {
        if (account.chainId === nextAccount.chainId) {
          nextAccount = {
            ...nextAccount,
            chainId: `${getRandomNumber(
              seededRandomNo,
              devnetConfig.NUMBER_OF_CHAINS,
            )}` as ChainId,
          };
        }
        logger.info('Cross chain transfer', account, nextAccount);
        result = await crossChainTransfer({
          from: account,
          to: nextAccount,
          amount,
        });
      } else {
        // Make sure the chain id is the same if the transfer type is transfer or safe-transfer
        if (account.chainId !== nextAccount.chainId) {
          nextAccount = { ...nextAccount, chainId: account.chainId };
        }

        if (isEqualChainAccounts(account, nextAccount)) {
          logger.info('Skipping transfer to self');
          continue;
        }

        // Using a random number to determine if the transfer is a safe transfer or not
        if (transferType === 'transfer') {
          result = await transfer({
            publicKey: nextAccount.publicKey,
            sender: account,
            amount,
            chainId: account.chainId,
          });
        }
        if (transferType === 'safe-transfer') {
          result = await safeTransfer({
            receiverKeyPair: nextAccount,
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
        type: transferType,
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
    // Timeout
    await new Promise((resolve) => setTimeout(resolve, transferInterval));
  }
}
