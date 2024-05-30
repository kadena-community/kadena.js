import path from 'node:path';
import { log } from '../../../utils/logger.js';
import { relativeToCwd } from '../../../utils/path.util.js';
import { writeAccountAliasMinimal } from '../../account/utils/createAccountConfigFile.js';

export const logWalletInfo = (
  words: string,
  filepath: string,
  publicKey: string,
): void => {
  log.info('====================================================');
  log.info('== 🚨 IMPORTANT: Mnemonic Phrase 🚨 ==');
  log.info('====================================================');
  log.info(log.color.green('Mnemonic Phrase:'));
  log.info(words);
  log.info(
    log.color.yellow(
      `\nPlease store the mnemonic phrase in a SAFE and SECURE place. \n` +
        `This phrase is the KEY to recover your wallet. Losing it means losing access to your assets.\n`,
    ),
  );
  log.info('====================================================\n');
  log.info(log.color.green('First keypair generated'));
  log.info(`publicKey: ${publicKey}\n`);
  log.info(log.color.green('Wallet Storage Location'));
  log.info(relativeToCwd(filepath));
};

export const logAccountCreation = (
  accountName: string,
  filePath: string,
): void => {
  log.info(log.color.green(`\nAccount created`));
  log.info(`accountName: ${accountName}\n`);
  log.info(log.color.green('Account Storage Location'));
  log.info(relativeToCwd(filePath));
};

export const createAccountAliasByPublicKey = async (
  alias: string,
  publicKey: string,
  directory: string,
): Promise<{
  accountName: string;
  accountFilepath: string;
}> => {
  const accountName = `k:${publicKey}`;
  const accountFilepath = path.join(directory, `${alias}.yaml`);
  await writeAccountAliasMinimal(
    {
      accountName,
      fungible: 'coin',
      predicate: `keys-all`,
      publicKeysConfig: [publicKey],
    },
    accountFilepath,
  );

  return {
    accountName,
    accountFilepath,
  };
};

/** find `amount` of free indexes starting at a `startIndex` while excluding indexes already in use by `existingIndexes` */
export function findFreeIndexes(
  amount: number,
  startIndex: number,
  existingIndexes: number[],
): number[] {
  const freeNumbers = [];
  let currentNumber = startIndex;

  while (freeNumbers.length < amount) {
    if (!existingIndexes.includes(currentNumber)) {
      freeNumbers.push(currentNumber);
    }
    currentNumber++;
  }

  return freeNumbers;
}
