// import { describeModule } from '@kadena/client-utils/built-in';
// import { Option } from 'commander';
import { createClient } from '@kadena/client';
import ora from 'ora';
// import { z } from 'zod';
// import { FAUCET_MODULE_NAME } from '../../constants/devnets.js';
// import deployDevNetFaucet from '../../devnet/faucet/deploy/index.js';
// import { networkIsAlive } from '../../devnet/utils/network.js';
// import { actionAskForDeployDevnet } from '../../prompts/genericActionPrompts.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
// import { createOption } from '../../utils/createOption.js';
import { NO_ACCOUNTS_FOUND_ERROR_MESSAGE } from '../../constants/account.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { notEmpty } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import {
  ensureAccountAliasFilesExists,
  getTransactionExplorerUrl,
} from '../utils/accountHelpers.js';
import { fund } from '../utils/fund.js';

// const deployDevnet = createOption({
//   key: 'deployDevnet',
//   validation: z.boolean(),
//   prompt: actionAskForDeployDevnet,
//   option: new Option('-d, --deploy-devnet', 'Deploy devnet if not available.'),
// });

/* bin/kadena-cli.js account fund --account="testnet.yaml" --amount="20" --network="testnet" --chain-id="0" */

export const createAccountFundCommand = createCommand(
  'fund',
  'Fund an existing/new account',
  [
    accountOptions.accountSelect(),
    accountOptions.fundAmount(),
    globalOptions.networkSelect(),
    accountOptions.chainIdRange(),
    // deployDevnet(),
  ],
  async (option) => {
    const isAccountAliasesExist = await ensureAccountAliasFilesExists();

    if (!isAccountAliasesExist) {
      return log.error(NO_ACCOUNTS_FOUND_ERROR_MESSAGE);
    }

    const { account, accountConfig } = await option.account();
    const { amount } = await option.amount();
    const { network, networkConfig } = await option.network({
      allowedNetworkIds: ['testnet04'],
    });
    const { chainId } = await option.chainId();

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

    if (['mainnet01', 'development'].includes(networkConfig.networkId)) {
      log.error(
        `\nNetwork "${network}" of id "${networkConfig.networkId}" is not supported.\n`,
      );
      return;
    }

    if (accountConfig.fungible.trim() !== 'coin') {
      log.error(`\nYou can't fund an account other than "coin" fungible.\n`);
      return;
    }

    // if (networkConfig.networkId === 'development') {
    //   if (!(await networkIsAlive(networkConfig.networkHost))) {
    //     console.log(
    //       chalk.red(
    //         `\nDevnet host "${networkConfig.networkHost}" is not running.\n`,
    //       ),
    //     );
    //     return;
    //   }

    //   const hasModuleAvailable = await describeModule(FAUCET_MODULE_NAME, {
    //     host: networkConfig.networkHost,
    //     defaults: {
    //       networkId: networkConfig.networkId,
    //       meta: { chainId: chainId },
    //     },
    //   }).catch(() => false);

    //   if (hasModuleAvailable === false) {
    //     console.log(
    //       chalk.yellow(
    //         `\nFaucet module is not available on chain "${chainId}" in "${networkConfig.network}".\n`,
    //       ),
    //     );

    //     const { deployDevnet } = await option.deployDevnet();

    //     if (!deployDevnet) {
    //       return;
    //     }

    //     console.log('\nDeploying faucet...\n');

    //     await deployDevNetFaucet([chainId]).catch((e) => {
    //       console.log(
    //         chalk.red(
    //           `\nFailed to deploy faucet module on chain "${chainId}" in "${network}".\n`,
    //         ),
    //       );
    //       throw Error(e);
    //     });
    //     console.log(
    //       chalk.green(
    //         `\nDeployed faucet module on chain "${chainId}" in "${network}".\n`,
    //       ),
    //     );
    //   }
    // }

    const result = await fund(config);
    if (result.success && result.data.length > 0) {
      result.data.forEach(({ chainId, requestKey }) => {
        const explorerUrl = getTransactionExplorerUrl(
          networkConfig.networkExplorerUrl,
          requestKey,
        );
        log.info(
          log.color.green(
            `Transaction explorer URL for Chain ID "${chainId}" is : ${explorerUrl}`,
          ),
        );
      });

      const loader = ora('Funding account...\n').start();
      const txErrors: string[] = [];
      const txResults = await Promise.all(
        result.data.map(async (transaction) => {
          const { requestKey, chainId } = transaction;
          try {
            const { pollStatus } = createClient(
              `${networkConfig.networkHost}/chainweb/0.0/${networkConfig.networkId}/chain/${chainId}/pact`,
            );
            const response = await pollStatus(transaction);
            const transactionResult = response[requestKey];
            if (
              typeof transactionResult !== 'string' &&
              transactionResult.result.status === 'failure'
            ) {
              throw transactionResult.result.error;
            }
            return { [chainId]: transactionResult };
          } catch (e) {
            txErrors.push(
              `ChainID: "${chainId}" - requestKey: ${requestKey} - ${e.message}`,
            );
          }
        }),
      );
      loader.stop();
      txResults.filter(notEmpty).forEach((txResult) => {
        const chainId = Object.keys(txResult)[0];
        log.info(
          log.color.green(
            `"${accountConfig.name}" account funded with "${amount}" on Chain ID "${chainId}" ${accountConfig.fungible} in ${networkConfig.networkId} network.\nUse "account details" command to check the balance.`,
          ),
        );
      });

      if (txErrors.length > 0) {
        log.error('Failed to fund account on following:');
        txErrors.forEach((error) => {
          log.error(error);
        });
      }
    }

    assertCommandError(result);
  },
);
