import type { ChainId } from '@kadena/client';
import { networkDefaults } from '../../../constants/networks.js';
import { services } from '../../../services/index.js';
import type { IWallet } from '../../../services/wallet/wallet.types.js';
import {
  CommandError,
  assertCommandError,
} from '../../../utils/command.util.js';
import type { CommandOption } from '../../../utils/createCommand.js';
import { notEmpty } from '../../../utils/globalHelpers.js';
import { log } from '../../../utils/logger.js';
import { findFreeIndexes } from '../../wallets/utils/walletHelpers.js';
import type { options } from '../accountAddOptions.js';
import { addAccount } from '../utils/addAccount.js';
import { displayAddAccountSuccess } from '../utils/addHelpers.js';
import { createAccountName } from '../utils/createAccountName.js';

async function generateAndStoreWalletKey(
  wallet: IWallet,
  passwordFile: string,
): Promise<string> {
  const indexes = findFreeIndexes(
    1,
    0,
    wallet.keys.map((x) => x.index),
  );

  const key = await services.wallet
    .generateKey({
      index: indexes[0],
      legacy: wallet.legacy,
      password: passwordFile,
      seed: wallet.seed,
    })
    .catch((error) => {
      throw new CommandError({
        errors: [
          `Something went wrong generating a new key, did you use the right password?`,
          error.message,
        ],
      });
    });
  await services.wallet.storeKey(wallet, key);

  return key.publicKey;
}

export const addAccountFromWallet = async (
  option: CommandOption<typeof options>,
): Promise<void> => {
  const { walletName, walletNameConfig } = await option.walletName();
  const wallet = walletNameConfig;
  if (!notEmpty(walletName)) {
    log.error(
      'Wallet name is required. Please check "--wallet-name" argument.',
    );
    return;
  }

  if (!wallet) {
    log.error(
      `Wallet :${walletName}"" does not exist. Please check the wallet name.`,
    );
    return;
  }

  if (wallet.keys.length === 0) {
    log.error(
      `Wallet ${walletName} does not contain any public keys. Please use "kadena wallet generate-key" command to generate keys.`,
    );
    return;
  }

  const accountAlias = (await option.accountAlias()).accountAlias;
  const fungible = (await option.fungible()).fungible || 'coin';
  const { publicKeys, publicKeysConfig } = await option.publicKeys({
    walletNameConfig: walletNameConfig,
  });

  // when --quiet is passed and public keys are not provided
  if (!notEmpty(publicKeysConfig) || publicKeysConfig?.length === 0) {
    throw new Error(
      'Missing required argument PublicKeys: "-k, --public-keys <publicKeys>"',
    );
  }

  if (publicKeysConfig.includes('_generate_')) {
    const { passwordFile } = await option.passwordFile({ wallet });

    const generatedPublicKey = await generateAndStoreWalletKey(
      wallet,
      passwordFile,
    );

    publicKeysConfig.push(generatedPublicKey);
  }

  const predicate = (await option.predicate()).predicate || 'keys-all';

  // filter out _generate_ from publicKeysConfig
  const filteredPublicKeys = publicKeysConfig.filter(
    (key) => key !== '_generate_',
  );
  const config = {
    wallet,
    accountAlias,
    fungible,
    predicate,
    publicKeys,
    publicKeysConfig: filteredPublicKeys,
  };

  //
  // Account name is not available in the wallet,
  // so we need to create it from the public keys and predicate.
  const accountName = await createAccountName({
    publicKeys: filteredPublicKeys,
    predicate,
    // we're creating a principal account based on the public keys
    // so we're just using the hardcoded chainId and networkConfig
    chainId: '0' as ChainId,
    networkConfig: networkDefaults.testnet,
  });

  const addAccountConfig = {
    accountName,
    accountAlias,
    fungible,
    publicKeysConfig: filteredPublicKeys,
    predicate,
  };

  log.debug('create-account-add-from-wallet:action', {
    ...config,
    accountName,
  });

  const result = await addAccount(addAccountConfig);

  assertCommandError(result);

  displayAddAccountSuccess(config.accountAlias, result.data);
};
