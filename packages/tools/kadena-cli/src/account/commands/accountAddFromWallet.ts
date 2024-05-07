import type { ChainId } from '@kadena/client';
import { networkDefaults } from '../../constants/networks.js';
import { assertCommandError } from '../../utils/command.util.js';
import type { CommandOption } from '../../utils/createCommand.js';
import { notEmpty } from '../../utils/globalHelpers.js';
import { log } from '../../utils/logger.js';
import type { options } from '../accountAddOptions.js';
import { addAccount } from '../utils/addAccount.js';
import { displayAddAccountSuccess } from '../utils/addHelpers.js';
import { createAccountName } from '../utils/createAccountName.js';

export const addAccountFromWallet = async (
  option: CommandOption<typeof options>,
): Promise<void> => {
  const wallet = await option.walletName();
  if (!notEmpty(wallet.walletName)) {
    log.error(
      'Wallet name is required. Please check "--wallet-name" argument.',
    );
    return;
  }

  if (!wallet.walletNameConfig) {
    log.error(
      `Wallet :${wallet.walletName}"" does not exist. Please check the wallet name.`,
    );
    return;
  }

  if (wallet.walletNameConfig.keys.length === 0) {
    log.error(
      `Wallet ${wallet.walletName} does not contain any public keys. Please use "kadena wallet generate-key" command to generate keys.`,
    );
    return;
  }

  const accountAlias = (await option.accountAlias()).accountAlias;
  const fungible = (await option.fungible()).fungible || 'coin';
  const { publicKeys, publicKeysConfig } = await option.publicKeys({
    walletNameConfig: wallet.walletNameConfig,
  });
  const predicate = (await option.predicate()).predicate || 'keys-all';
  const config = {
    wallet,
    accountAlias,
    fungible,
    predicate,
    publicKeys,
    publicKeysConfig,
  };

  // Account name is not available in the wallet,
  // so we need to create it from the public keys and predicate.
  const accountName = await createAccountName({
    publicKeys: publicKeysConfig,
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
    publicKeysConfig,
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
