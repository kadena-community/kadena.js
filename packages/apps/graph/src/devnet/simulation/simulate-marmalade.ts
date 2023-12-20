import {
  IAccountWithTokens,
  generateAccount,
  getRandomNumber,
  logger,
  seedRandom,
  stringifyProperty,
} from '@devnet/helper';
import { createToken } from '@devnet/marmalade/token/create-token';
import { createTokenId } from '@devnet/marmalade/token/create-token-id';
import { mintToken } from '@devnet/marmalade/token/mint-token';
import { transferCreateToken } from '@devnet/marmalade/token/transfer-create-token';
import { transfer } from '@devnet/transfer';
import { PactNumber } from '@kadena/pactjs';
import { TokenActionType, appendToFile, createFile } from './file';

const simulationTransferOptions: TokenActionType[] = ['mint', 'transfer'];

export interface IMarmaladeSimulationOptions {
  numberOfAccounts: number;
  transferInterval: number;
  maxNumberOfCirculatingTokens: number;
  seed: string;
}

export async function simulateMarmalade({
  numberOfAccounts = 2,
  transferInterval = 100,
  maxNumberOfCirculatingTokens = 50,
  seed = Date.now().toString(),
}: IMarmaladeSimulationOptions): Promise<void> {
  const accounts: IAccountWithTokens[] = [];

  // Parameters validation
  if (numberOfAccounts <= 1) {
    logger.info('Number of accounts must be greater than 1');
    return;
  }

  if (numberOfAccounts < maxNumberOfCirculatingTokens) {
    logger.info(
      'Number of accounts must be greater than max number of circulating tokens',
    );
    return;
  }

  logger.info('Seed value: ', seed);
  const filepath = createFile(`nft-${Date.now()}-${seed}.csv`);

  // Generate first seeded random number
  let seededRandomNo = seedRandom(seed);

  let circulatingTokens = 0;

  try {
    // Create accounts, fund them, mint tokens and transfer them
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

      // Fund account
      const coinAmount = 1000;
      logger.info(`Funding account with ${coinAmount} (for gas fees)`);
      const coinTransferResult = await transfer({
        receiver: account,
        amount: coinAmount,
      });

      appendToFile(filepath, {
        timestamp: Date.now(),
        from: 'sender00',
        to: account.account,
        amount: coinAmount,
        requestKey: coinTransferResult.reqKey,
        action: 'fund',
      });

      // Create Token
      const uri = `https://www.${Date.now()}.com`;
      const tokenId = await createTokenId({ creator: account, uri });

      const createResult = await createToken({
        creator: account,
        uri,
        tokenId,
      });

      logger.info(`Created Token: ${tokenId}`);

      appendToFile(filepath, {
        timestamp: Date.now(),
        from: 'n/a',
        to: account.account,
        amount: 0,
        requestKey: createResult.reqKey,
        action: 'create',
      });

      const tokenAmount = getRandomNumber(
        seededRandomNo,
        // maximum amount of tokens that can be minted initially (maxNumberOfCirculatingTokens / numberOfAccounts * 2)
        maxNumberOfCirculatingTokens / numberOfAccounts,
      );

      // Mint Token
      const mintResult = await mintToken({
        creator: account.account,
        tokenId,
        amount: new PactNumber(tokenAmount).toPactDecimal(),
        guard: account,
      });

      circulatingTokens += tokenAmount;

      appendToFile(filepath, {
        timestamp: Date.now(),
        from: 'n/a',
        to: account.account,
        amount: tokenAmount,
        requestKey: mintResult.reqKey,
        action: 'mint',
      });

      accounts.push({
        ...account,
        tokens: {
          [tokenId]: tokenAmount,
        },
      });

      if (i === 0) {
        continue;
      }

      // Transfer 1 Token in order to have both token actions at the beginning
      const nextAccount = accounts[i - 1];

      const transferResult = await transferCreateToken({
        tokenId,
        sender: account,
        receiver: nextAccount,
        amount: new PactNumber(1).toPactDecimal(),
      });

      appendToFile(filepath, {
        timestamp: Date.now(),
        from: account.account,
        to: nextAccount.account,
        amount: tokenAmount,
        requestKey: transferResult.reqKey,
        action: 'transfer',
      });

      let accountToUpdate = accounts.find(
        (a) => a.account === nextAccount.account,
      );

      if (accountToUpdate) {
        accountToUpdate.tokens = {
          ...accountToUpdate.tokens,
          [tokenId]: (accountToUpdate.tokens?.[tokenId] || 0) + 1,
        };
      }

      //Rotate seeded random number
      seededRandomNo = seedRandom(`${seededRandomNo}`);
    }

    let counter: number = 0;

    while (true) {
      for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        const amount: number = getRandomNumber(
          seededRandomNo,
          maxNumberOfCirculatingTokens,
        );

        // On the first iterations, we can only mint tokens
        if (counter < accounts.length) {
          counter++;
        }

        // mintToken({});

        counter++;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export function getAvailableTokens(account: IAccountWithTokens): string[] {
  return Object.keys(account.tokens).filter(
    (tokenId) => account.tokens[tokenId] > 0,
  );
}
