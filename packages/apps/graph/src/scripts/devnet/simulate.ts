import { crossChainTransfer } from './crosschain-transfer';
import type { IAccount } from './helper';
import { createAccount, getRandomChainId } from './helper';
import { transfer } from './transfer';

export async function simulate(
  noAccounts: number = 2,
  transferInterval: number = 2000,
  amount: number = 10,
): Promise<void> {
  const accounts: IAccount[] = [];

  // Create accounts
  for (let i = 0; i < noAccounts; i++) {
    const account = createAccount();
    console.log(
      `Generated KeyPair\nAccount: ${account.account}\nPublic Key: ${account.publicKey}\nSecret Key: ${account.secretKey}\n`,
    );
    accounts.push(account);
  }

  while (true) {
    // Transfer between accounts
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      //Fund the account
      await transfer(account);
      let nextAccount = accounts[(i + 1) % accounts.length];

      // This is to simulate cross chain transfers
      // Every nth transfer is a cross chain transfer;
      if (i % Math.floor(Math.random() * accounts.length) === 0) {
        nextAccount = { ...nextAccount, chainId: getRandomChainId() };
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

    // Timeout
    await new Promise((resolve) => setTimeout(resolve, transferInterval));
  }
}
