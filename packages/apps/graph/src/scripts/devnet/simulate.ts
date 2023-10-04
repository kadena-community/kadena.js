import type { ChainId } from '@kadena/client';

import { devnetConfig } from './config';
import { crossChainTransfer } from './crosschain-transfer';
import { appendToFile, createFile } from './file';
import { getBalance } from './get-balance';
import type { IAccount } from './helper';
import { createAccount, getRandomNumber, logger } from './helper';
import { transfer } from './transfer';

import seedrandom from 'seedrandom';

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
    const account = createAccount();
    logger.info(
      `Generated KeyPair\nAccount: ${account.account}\nPublic Key: ${account.publicKey}\nSecret Key: ${account.secretKey}\n`,
    );
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
  let randomNo = seedrandom(seed)();
  let counter: number = 0;

  while (true) {
    // Transfer between accounts
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const amount: number = getRandomNumber(randomNo, maxAmount);

      // To avoid underflowing the token pool, we fund an account
      if (counter >= tokenPool / maxAmount) {
        await transfer({
          publicKey: account.publicKey,
          amount: tokenPool / numberOfAccounts,
        });
        counter = 0;
      }

      const balance = (await getBalance(account)) as number;

      if (amount > balance) {
        logger.info(
          `Insufficient funds for ${account.account}\nFunds necessary: ${amount}\nFunds available: ${balance}`,
        );
        logger.info('Skipping transfer');
        continue;
      }

      // Generate seeded random number based on the previous number
      randomNo = seedrandom(`${randomNo}`)();

      let nextAccount = accounts[getRandomNumber(randomNo, accounts.length)];

      // This is to simulate cross chain transfers
      // Every nth transfer is a cross chain transfer;
      if (i % getRandomNumber(randomNo, accounts.length) === 0) {
        nextAccount = {
          ...nextAccount,
          chainId: `${getRandomNumber(
            randomNo,
            devnetConfig.NUMBER_OF_CHAINS,
          )}` as ChainId,
        };
      }

      if (account === nextAccount) {
        logger.info('Skipping transfer to self');
        continue;
      }

      if (account.chainId === nextAccount.chainId) {
        const result = await transfer({
          publicKey: nextAccount.publicKey,
          sender: account,
          amount,
        });
        appendToFile(filepath, {
          timestamp: Date.now(),
          from: account.account,
          to: nextAccount.account,
          amount,
          requestKey: result.reqKey,
          type: 'transfer',
        });
      } else {
        const result = await crossChainTransfer({
          from: account,
          to: nextAccount,
          amount,
        });
        appendToFile(filepath, {
          timestamp: Date.now(),
          from: account.account,
          to: nextAccount.account,
          amount,
          requestKey: result.reqKey,
          type: 'xchaintransfer',
        });
      }

      // If the account is not in the accountlist, add it
      if (!accounts.includes(nextAccount)) {
        accounts.push(nextAccount);
      }

      await new Promise((resolve) => setTimeout(resolve, transferInterval));
    }
    counter++;
    // Timeout
    await new Promise((resolve) => setTimeout(resolve, transferInterval));
  }
}
