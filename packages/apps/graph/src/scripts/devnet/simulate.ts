import type { IAccount } from './helper';
import { createAccount, sender00 } from './helper';
import { transfer } from './transfer';

export async function simulate(
  noAccounts: number = 2,
  transferInterval: number = 2000,
  transferAmount: number = 10,
) {
  const accounts: IAccount[] = [];

  // Create accounts
  for (let i = 0; i < noAccounts; i++) {
    const account = createAccount();
    console.log(
      `Generated KeyPair\nAccount: ${account.account}\nPublic Key: ${account.publicKey}\nSecret Key: ${account.secretKey}\n`,
    );
    accounts.push(account);
  }

  // Fund accounts
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    await transfer(account.publicKey, sender00);
  }

  while (true) {
    // Transfer between accounts
    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const nextAccount = accounts[(i + 1) % accounts.length];
      await transfer(nextAccount.publicKey, account, transferAmount);
      await new Promise((resolve) => setTimeout(resolve, transferInterval));
    }

    // Timeout
    await new Promise((resolve) => setTimeout(resolve, transferInterval));
  }
}
