import ora from 'ora';
import {
  CHAIN_ID_ACTION_ERROR_MESSAGE,
  MAX_FUND_AMOUNT,
  NO_ACCOUNTS_FOUND_ERROR_MESSAGE,
} from '../../constants/account.js';
import { FAUCET_MODULE_NAME } from '../../constants/devnets.js';
import { checkHealth } from '../../devnet/utils/network.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { notEmpty } from '../../utils/globalHelpers.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import {
  ensureAccountAliasFilesExists,
  sortChainIds,
} from '../utils/accountHelpers.js';
import { fund } from '../utils/fund.js';
import {
  deployFaucetsToChains,
  findMissingModuleDeployments,
  getTxDetails,
  logAccountFundingTxResults,
  logTransactionExplorerUrls,
} from '../utils/fundHelpers.js';

export const createAccountFundCommand = createCommand(
  'fund',
  'Fund an existing/new account',
  [
    accountOptions.accountSelect(),
    globalOptions.networkSelect(),
    accountOptions.chainIdRange(),
    accountOptions.fundAmount(),
    accountOptions.deployFaucet(),
  ],
  async (option) => {
    const isAccountAliasesExist = await ensureAccountAliasFilesExists();

    if (!isAccountAliasesExist) {
      return log.error(NO_ACCOUNTS_FOUND_ERROR_MESSAGE);
    }

    const { account, accountConfig } = await option.account();
    const { network, networkConfig } = await option.network({
      allowedNetworkIds: ['testnet', 'development'],
    });
    const { chainIds } = await option.chainIds();
    if (!notEmpty(chainIds)) {
      return log.error(CHAIN_ID_ACTION_ERROR_MESSAGE);
    }

    const maxAmount = Math.floor(MAX_FUND_AMOUNT / chainIds.length);
    const { amount } = await option.amount({
      maxAmount: maxAmount,
      numberOfChains: chainIds.length,
    });

    if (!notEmpty(accountConfig)) {
      return log.error(
        `Account details are missing. Please check "${account}" account alias file.`,
      );
    }

    const config = {
      accountConfig,
      amount,
      chainIds,
      networkConfig,
    };

    log.debug('account-fund:action', config);

    if (networkConfig.networkId.includes('mainnet') === true) {
      return log.error(
        `Fundings are not allowed on "${networkConfig.networkId}" network.`,
      );
    }

    if (accountConfig.fungible.trim() !== 'coin') {
      return log.error(`You can't fund an account other than "coin" fungible.`);
    }

    if (networkConfig.networkId.includes('development') === true) {
      if (!(await checkHealth(networkConfig.networkHost))) {
        return log.error(
          `Devnet host "${networkConfig.networkHost}" is not running.`,
        );
      }

      const undeployedChainIds = await findMissingModuleDeployments(
        FAUCET_MODULE_NAME,
        networkConfig,
        chainIds,
      );

      const undeployedChainIdsStr = sortChainIds(undeployedChainIds).join(', ');

      if (undeployedChainIds.length > 0) {
        log.warning(
          `Faucet module unavailable on chain "${undeployedChainIdsStr}" in the "${networkConfig.network}" network.`,
        );

        const { deployFaucet } = await option.deployFaucet();

        if (deployFaucet === false) {
          return log.warning(
            `To fund your account on chain "${undeployedChainIdsStr}" in the "${networkConfig.network}" network, deploy the faucet using the --deploy-faucet option.`,
          );
        }

        const loader = ora(
          `Deploying faucet on chain Id(s): "${undeployedChainIdsStr}" in "${network}" network...\n`,
        ).start();

        const [succeededFaucetDeployments, failedFaucetDeployments] =
          await deployFaucetsToChains(chainIds);

        if (failedFaucetDeployments.length > 0) {
          const completeError = succeededFaucetDeployments.length === 0;
          const loaderState = completeError ? 'fail' : 'warn';
          loader[loaderState](
            `Failed to deploy faucet module on "${network}" network in the following chain Id(s):\n`,
          );
          failedFaucetDeployments.forEach(({ chainId, message }) => {
            log.error(`Chain Id: ${chainId}, Error: ${message}`);
          });
        }

        if (succeededFaucetDeployments.length === 0) {
          return;
        }

        loader.succeed(
          `\nDeployed faucet module on chain "${undeployedChainIdsStr}" in "${network}" network.\n`,
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
