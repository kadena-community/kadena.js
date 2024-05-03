import path from 'node:path';
import { writeAccountAliasMinimal } from '../../account/utils/createAccountConfigFile.js';
import { log } from '../../utils/logger.js';
import { relativeToCwd } from '../../utils/path.util.js';

export const logWalletInfo = (
  words: string,
  filepath: string,
  publicKey: string,
): void => {
  log.info(log.color.green('Mnemonic Phrase'));
  log.info(words);
  log.info(
    log.color.yellow(
      `\nPlease store the mnemonic phrase in a safe place. You will need it to recover your wallet.\n`,
    ),
  );
  log.info(log.color.green('First keypair generated'));
  log.info(`publicKey: ${publicKey}\n`);
  log.info(log.color.green('Wallet Storage Location'));
  log.info(relativeToCwd(filepath));
};

export const logAccountCreation = (
  accountName: string,
  filePath: string,
): void => {
  log.info(log.color.green(`\nAccount added`));
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
