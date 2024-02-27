// import { describeModule } from '@kadena/client-utils/built-in';
// import { Option } from 'commander';
import ora from 'ora';
// import { z } from 'zod';
// import { FAUCET_MODULE_NAME } from '../../constants/devnets.js';
// import deployDevNetFaucet from '../../devnet/faucet/deploy/index.js';
// import { networkIsAlive } from '../../devnet/utils/network.js';
// import { actionAskForDeployDevnet } from '../../prompts/genericActionPrompts.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
// import { createOption } from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
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
    globalOptions.chainId(),
    // deployDevnet(),
  ],
  async (option) => {
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

    if (['mainnet01', 'fast-development'].includes(networkConfig.networkId)) {
      log.error(
        `\nNetwork "${network}" of id "${networkConfig.networkId}" is not supported.\n`,
      );
      return;
    }

    if (accountConfig.fungible.trim() !== 'coin') {
      log.error(`\nYou can't fund an account other than "coin" fungible.\n`);
      return;
    }

    // if (networkConfig.networkId === 'fast-development') {
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

    const loader = ora('Funding account...\n').start();

    const result = await fund(config);
    assertCommandError(result, loader);

    log.info(
      log.color.green(
        `"${accountConfig.name}" account funded with "${amount}" ${accountConfig.fungible} on chain ${chainId} in ${networkConfig.networkId} network.`,
      ),
    );
  },
);
