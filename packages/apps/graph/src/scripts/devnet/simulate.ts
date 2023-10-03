import type { ChainId } from '@kadena/client';

import { devnetConfig } from './config';
import { crossChainTransfer } from './crosschain-transfer';
import { getBalance } from './get-balance';
import type { IAccount } from './helper';
import { createAccount, getRandomNumber } from './helper';
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
    console.log('Invalid parameters');
    return;
  }

  // Create accounts
  for (let i = 0; i < numberOfAccounts; i++) {
    const account = createAccount();
    console.log(
      `Generated KeyPair\nAccount: ${account.account}\nPublic Key: ${account.publicKey}\nSecret Key: ${account.secretKey}\n`,
    );
    accounts.push(account);

    // Fund account
    await transfer({
      publicKey: account.publicKey,
      amount: tokenPool / numberOfAccounts,
    });
  }
  console.log('Seed value: ', seed);

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
        console.log(
          `Insufficient funds for ${account.account}\nFunds necessary: ${amount}\nFunds available: ${balance}`,
        );
        console.log('Skipping transfer');
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
            devnetConfig.NO_CHAINS,
          )}` as ChainId,
        };
      }

      if (account === nextAccount) {
        console.log('Skipping transfer to self');
        continue;
      }

      if (account.chainId === nextAccount.chainId) {
        await transfer({
          publicKey: nextAccount.publicKey,
          sender: account,
          amount,
        });
      } else {
        await crossChainTransfer({
          from: account,
          to: nextAccount,
          amount,
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
