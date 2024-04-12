import { describeModule } from '@kadena/client-utils/built-in';
import ora from 'ora';
import {
  CHAIN_ID_ACTION_ERROR_MESSAGE,
  NO_ACCOUNTS_FOUND_ERROR_MESSAGE,
} from '../../constants/account.js';
import { FAUCET_MODULE_NAME } from '../../constants/devnets.js';
import deployDevNetFaucet from '../../devnet/faucet/deploy/index.js';
import { networkIsAlive } from '../../devnet/utils/network.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import { ensureAccountAliasFilesExists } from '../utils/accountHelpers.js';
import { fund } from '../utils/fund.js';
import {
  getTxDetails,
  logAccountFundingTxResults,
  logTransactionExplorerUrls,
} from '../utils/fundHelpers.js';

export const createAccountFundCommand = createCommand(
  'fund',
  'Fund an existing/new account',
  [
    accountOptions.accountSelect(),
    accountOptions.fundAmount(),
    globalOptions.networkSelect(),
    accountOptions.chainIdRange(),
    accountOptions.deployDevnet(),
  ],
  async (option) => {
    const isAccountAliasesExist = await ensureAccountAliasFilesExists();

    if (!isAccountAliasesExist) {
      return log.error(NO_ACCOUNTS_FOUND_ERROR_MESSAGE);
    }

    const { account, accountConfig } = await option.account();
    const { amount } = await option.amount();
    const { network, networkConfig } = await option.network({
      allowedNetworkIds: ['testnet04', 'development'],
    });
    const { chainId } = await option.chainId();

    if (chainId === undefined) {
      log.error(CHAIN_ID_ACTION_ERROR_MESSAGE);
      return;
    }

    if (!accountConfig) {
      log.error(
        `\nAccount details are missing. Please check selected "${account}" account alias file.\n`,
      );
      return;
    }

    const config = {
      accountConfig,
      amount,
      chainId,
      networkConfig,
    };

    log.debug('account-fund:action', config);

    if (['mainnet01'].includes(networkConfig.networkId)) {
      return log.error(
        `\nNetwork "${network}" of id "${networkConfig.networkId}" is not supported.\n`,
      );
    }

    if (accountConfig.fungible.trim() !== 'coin') {
      return log.error(
        `\nYou can't fund an account other than "coin" fungible.\n`,
      );
    }

    if (networkConfig.networkId === 'development') {
      if (!(await networkIsAlive(networkConfig.networkHost))) {
        return log.error(
          `Devnet host "${networkConfig.networkHost}" is not running.`,
        );
      }

      const hasModuleAvailable = await describeModule(FAUCET_MODULE_NAME, {
        host: networkConfig.networkHost,
        defaults: {
          networkId: networkConfig.networkId,
          meta: { chainId: chainId[0] },
        },
      }).catch(() => false);

      if (hasModuleAvailable === false) {
        log.warning(
          `\nFaucet module is not available on chain "${chainId}" in "${networkConfig.network}".\n`,
        );

        const { deployDevnet } = await option.deployDevnet();

        if (!deployDevnet) {
          return;
        }

        log.info('  Deploying faucet...\n');

        await deployDevNetFaucet(chainId).catch((e) => {
          log.error(
            `\nFailed to deploy faucet module on chain "${chainId}" in "${network}".\n`,
          );
          throw Error(e);
        });
        log.info(
          log.color.green(
            `\nDeployed faucet module on chain "${chainId}" in "${network}".\n`,
          ),
        );
      }
    }

    const result = await fund(config);
    const isSuccessOrParitalSuccess =
      result.status === 'success' || result.status === 'partial';
    assertCommandError(result);
    logTransactionExplorerUrls(result, networkConfig.networkExplorerUrl);
    if (isSuccessOrParitalSuccess && result.data.length > 0) {
      const loader = ora('Funding account...\n').start();
      const { txResults, txErrors } = await getTxDetails(
        result.data,
        networkConfig.networkHost,
        networkConfig.networkId,
      );

      if (txErrors.length === 0) {
        loader.succeed('Funding account successful.');
      } else {
        loader.fail('Failed to fund account.');
      }

      logAccountFundingTxResults(
        txResults,
        txErrors,
        accountConfig.name,
        accountConfig.fungible,
        amount,
        networkConfig.networkId,
      );
    }
  },
);
