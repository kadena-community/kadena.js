import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import { addAccount } from '../utils/addAccount.js';
import { displayAddAccountSuccess } from '../utils/addHelpers.js';
import { validateAndRetrieveAccountDetails } from '../utils/validateAndRetrieveAccountDetails.js';

export const createAddAccountFromWalletCommand = createCommand(
  'add-from-wallet',
  'Add an account from a key wallet',
  [
    globalOptions.walletSelect(),
    accountOptions.accountAlias(),
    accountOptions.fungible(),
    globalOptions.networkSelect(),
    globalOptions.chainId(),
    accountOptions.selectPublicKeys(),
    accountOptions.predicate(),
    accountOptions.accountOverwrite(),
  ],

  async (option, values) => {
    const wallet = await option.walletName();
    const accountAlias = (await option.accountAlias()).accountAlias;
    if (!wallet.walletNameConfig) {
      log.error(`Wallet ${wallet.walletName} does not exist.`);
      return;
    }

    if (wallet.walletNameConfig.keys.length === 0) {
      log.error(
        `Wallet ${wallet.walletName} does not contain any public keys. Please use "kadena wallet generate-keys" command to generate keys.`,
      );
      return;
    }

    const fungible = (await option.fungible()).fungible || 'coin';
    const { network, networkConfig } = await option.network();
    const chainId = (await option.chainId()).chainId;
    const { publicKeys, publicKeysConfig } = await option.publicKeys({
      values,
      walletNameConfig: wallet.walletNameConfig,
    });
    const predicate = (await option.predicate()).predicate || 'keys-all';
    const config = {
      accountAlias,
      wallet,
      fungible,
      network,
      networkConfig,
      chainId,
      predicate,
      publicKeys,
      publicKeysConfig,
      accountOverwrite: false,
    };

    // Account name is not available in the wallet,
    // so we need to create it from the public keys
    // and check if account already exists on chain
    const { accountName, accountDetails, isConfigAreSame } =
      await validateAndRetrieveAccountDetails(config);

    let accountOverwrite = false;
    if (!isConfigAreSame) {
      accountOverwrite = (await option.accountOverwrite()).accountOverwrite;
    }

    const updatedConfig = {
      ...config,
      accountName,
      accountDetailsFromChain: accountDetails,
      accountOverwrite,
    };

    log.debug('create-account-add-from-wallet:action', updatedConfig);

    const result = await addAccount(updatedConfig);

    assertCommandError(result);

    displayAddAccountSuccess(config.accountAlias, result.data);
  },
);
