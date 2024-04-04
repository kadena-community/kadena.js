import { transfer } from '@devnet/simulation/coin/transfer';
import { createToken } from '@devnet/simulation/marmalade/create-token';
import { createTokenId } from '@devnet/simulation/marmalade/create-token-id';
import { mintToken } from '@devnet/simulation/marmalade/mint-token';
import { transferCreateToken } from '@devnet/simulation/marmalade/transfer-create-token';
import type { IAccount, IAccountWithTokens } from '@devnet/utils';
import { PactNumber } from '@kadena/pactjs';
import { logger } from '@utils/logger';
import type { TokenActionType } from '../file';
import { appendToFile, createFile } from '../file';
import {
  generateAccount,
  getRandomNumber,
  getRandomOption,
  seedRandom,
  stringifyProperty,
} from '../helper';

const simulationTransferOptions: TokenActionType[] = ['mint', 'transfer'];

export interface IMarmaladeSimulationOptions {
  numberOfAccounts: number;
  transferInterval: number;
  maximumMintValue: number;
  seed: string;
}

export async function simulateMarmalade({
  numberOfAccounts = 10,
  transferInterval = 100,
  maximumMintValue = 20,
  seed = Date.now().toString(),
}: IMarmaladeSimulationOptions): Promise<void> {
  const accountCollection: IAccountWithTokens[] = [];

  // Parameters validation
  if (numberOfAccounts <= 1) {
    logger.error('Number of accounts must be greater than 1');
    return;
  }

  if (maximumMintValue < 1) {
    logger.error(
      'The max transfer amount cant be less than 1 (minimum mint amount)',
    );
    return;
  }

  logger.info('Seed value: ', seed);
  const filepath = createFile(`marmalade-${Date.now()}-${seed}.csv`);

  // Generate first seeded random number
  let seededRandomNo = seedRandom(seed);

  try {
    // Create accounts, fund them, mint tokens and transfer them
    for (let i = 0; i < numberOfAccounts; i++) {
      // This will determine if the account has 1 or 2 keys (even = 1 key, odd = 2 keys)
      const noOfKeys = i % 2 === 0 ? 1 : 2;
      const account = await generateAccount(noOfKeys);

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
      await fundNewAccount({ account, amount: coinAmount, filepath });

      const tokenAmount = getRandomNumber(
        seededRandomNo,
        // maximum amount of tokens that can be minted initially (maxNumberOfCirculatingTokens / numberOfAccounts * 2)
        maximumMintValue,
      );

      // Rotate seeded random number
      seededRandomNo = seedRandom(`${seededRandomNo}`);

      // Create and Mint Token
      const tokenId = await createAndMintToken({
        uri: `https://www.${Date.now()}.com`,
        creator: account,
        amount: tokenAmount,
        filepath,
        accountCollection,
      });

      if (i === 0) {
        continue;
      }

      // Transfer 1 Token in order to have both token actions at the beginning
      const nextAccount = accountCollection[i - 1];

      await transferToken({
        tokenId,
        sender: account,
        receiver: nextAccount,
        amount: 1,
        filepath,
        accountCollection,
      });
    }

    while (true) {
      for (let i = 0; i < accountCollection.length; i++) {
        // Choose account from
        const account = accountCollection[i];

        // Select random action type
        const transferType = getRandomOption(
          seededRandomNo,
          simulationTransferOptions,
        );

        // Rotate seeded random number
        seededRandomNo = seedRandom(`${seededRandomNo}`);

        if (transferType === 'mint') {
          const mintAmount: number = getRandomNumber(
            seededRandomNo,
            maximumMintValue,
          );

          // Rotate seeded random number
          seededRandomNo = seedRandom(`${seededRandomNo}`);

          const mintOption = getRandomOption(seededRandomNo, [
            'new',
            'existing',
          ]);

          // Rotate seeded random number
          seededRandomNo = seedRandom(`${seededRandomNo}`);

          if (mintOption === 'new') {
            await createAndMintToken({
              creator: account,
              amount: mintAmount,
              uri: `https://www.${Date.now()}.com`,
              filepath,
              accountCollection,
            });
          } else if (mintOption === 'existing') {
            const tokenId = getRandomOption(
              seededRandomNo,
              Object.keys(account.tokens),
            );

            // Rotate seeded random number
            seededRandomNo = seedRandom(`${seededRandomNo}`);

            await mintExistingToken({
              creator: account,
              tokenId,
              amount: mintAmount,
              filepath,
              accountCollection,
            });
          }
        } else if (transferType === 'transfer') {
          const nextAccount =
            accountCollection[
              getRandomNumber(seededRandomNo, accountCollection.length)
            ];

          // Rotate seeded random number
          seededRandomNo = seedRandom(`${seededRandomNo}`);

          if (nextAccount.account === account.account) {
            logger.warn('Skipping transfer to self');
            continue;
          }

          // Get random token to transfer
          const randomToken = getRandomOption(
            seededRandomNo,
            Object.keys(account.tokens),
          );

          // Rotate seeded random number
          seededRandomNo = seedRandom(`${seededRandomNo}`);

          // Get random amount to transfer
          const transferAmount: number = getRandomNumber(
            seededRandomNo,
            account.tokens[randomToken],
          );

          // Rotate seeded random number
          seededRandomNo = seedRandom(`${seededRandomNo}`);

          if (transferAmount < 1) {
            logger.warn('Skipping transfer of 0 tokens');
            continue;
          }

          if (transferAmount > account.tokens[randomToken]) {
            logger.warn('Skipping transfer of more tokens than available');
            continue;
          }

          await transferToken({
            tokenId: randomToken,
            sender: account,
            receiver: nextAccount,
            amount: transferAmount,
            filepath,
            accountCollection,
          });
        }

        await new Promise((resolve) => setTimeout(resolve, transferInterval));
      }
    }
  } catch (error) {
    logger.error(error);
    appendToFile(filepath, { error: JSON.stringify(error) });
    throw error;
  }
}

export async function fundNewAccount({
  account,
  amount,
  filepath,
}: {
  account: IAccount;
  amount: number;
  filepath: string;
}): Promise<void> {
  logger.info(`Funding account with ${amount} (for gas fees)`);

  const coinTransferResult = await transfer({
    receiver: account,
    amount: amount,
  });

  appendToFile(filepath, {
    timestamp: Date.now(),
    from: 'sender00',
    to: account.account,
    amount: amount,
    requestKey: coinTransferResult.reqKey,
    action: 'fund',
  });
}

export function getAvailableTokens(account: IAccountWithTokens): string[] {
  return Object.keys(account.tokens).filter(
    (tokenId) => account.tokens[tokenId] > 0,
  );
}

export async function createAndMintToken({
  creator,
  amount,
  uri,
  filepath,
  accountCollection,
}: {
  creator: IAccountWithTokens | IAccount;
  amount: number;
  uri: string;
  filepath: string;
  accountCollection: IAccountWithTokens[];
}) {
  const tokenId = await createTokenId({ creator, uri });

  const createResult = await createToken({
    creator,
    uri,
    tokenId,
  });

  logger.info(`Created Token: ${tokenId}`);

  appendToFile(filepath, {
    timestamp: Date.now(),
    from: 'n/a',
    to: creator.account,
    amount: 0,
    requestKey: createResult.reqKey,
    action: 'create',
  });

  logger.info(
    `Minting token ${tokenId}\nAmount ${amount}\nCreator ${creator.account}`,
  );

  const mintResult = await mintToken({
    creator: creator.account,
    tokenId,
    amount: new PactNumber(amount).toPactDecimal(),
    guard: creator,
  });

  appendToFile(filepath, {
    timestamp: Date.now(),
    from: 'n/a',
    to: creator.account,
    amount: amount,
    requestKey: mintResult.reqKey,
    action: 'mint',
  });

  // If account already exists in array, add the token. If not add the account to the array
  const accountToUpdate = accountCollection.find(
    (acc) => acc.account === creator.account,
  );

  if (accountToUpdate) {
    accountToUpdate.tokens = {
      ...accountToUpdate.tokens,
      [tokenId]: amount,
    };
  } else {
    accountCollection.push({
      ...creator,
      tokens: {
        [tokenId]: amount,
      },
    });
  }
  return tokenId;
}

export async function transferToken({
  tokenId,
  sender,
  receiver,
  amount,
  filepath,
  accountCollection,
}: {
  tokenId: string;
  sender: IAccountWithTokens | IAccount;
  receiver: IAccountWithTokens | IAccount;
  amount: number;
  filepath: string;
  accountCollection: IAccountWithTokens[];
}) {
  logger.info(
    `Transfering token ${tokenId}\nAmount ${amount}\nSender ${sender.account}\nReceiver ${receiver.account}`,
  );

  const transferResult = await transferCreateToken({
    tokenId,
    sender,
    receiver,
    amount: new PactNumber(1).toPactDecimal(),
  });

  appendToFile(filepath, {
    timestamp: Date.now(),
    from: sender.account,
    to: receiver.account,
    amount: amount,
    requestKey: transferResult.reqKey,
    action: 'transfer',
  });

  // Update sender account
  const senderAccountToUpdate = accountCollection.find(
    (a) => a.account === sender.account,
  );
  if (!senderAccountToUpdate) {
    throw Error('Sender account not found');
  }
  senderAccountToUpdate.tokens = {
    ...senderAccountToUpdate.tokens,
    [tokenId]: (senderAccountToUpdate.tokens?.[tokenId] || 0) - amount,
  };

  // Update receiver account
  const accountToUpdate = accountCollection.find(
    (a) => a.account === receiver.account,
  );

  if (accountToUpdate) {
    accountToUpdate.tokens = {
      ...accountToUpdate.tokens,
      [tokenId]: (accountToUpdate.tokens?.[tokenId] || 0) + amount,
    };
  }
}

export async function mintExistingToken({
  creator,
  tokenId,
  amount,
  filepath,
  accountCollection,
}: {
  creator: IAccountWithTokens | IAccount;
  tokenId: string;
  amount: number;
  filepath: string;
  accountCollection: IAccountWithTokens[];
}) {
  logger.info(
    `Minting existing token ${tokenId}\nAmount ${amount}\nCreator ${creator.account}`,
  );

  const mintResult = await mintToken({
    creator: creator.account,
    tokenId,
    amount: new PactNumber(amount).toPactDecimal(),
    guard: creator,
  });

  appendToFile(filepath, {
    timestamp: Date.now(),
    from: 'n/a',
    to: creator.account,
    amount: amount,
    requestKey: mintResult.reqKey,
    action: 'mint',
  });

  // If account already exists in array, add the token. If not add the account to the array
  const accountToUpdate = accountCollection.find(
    (acc) => acc.account === creator.account,
  );

  if (accountToUpdate) {
    accountToUpdate.tokens = {
      ...accountToUpdate.tokens,
      [tokenId]: (accountToUpdate.tokens?.[tokenId] || 0) + 1,
    };
  } else {
    accountCollection.push({
      ...creator,
      tokens: {
        [tokenId]: amount,
      },
    });
  }
}
