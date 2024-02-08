import type { ChainId } from '@kadena/client';
import {
  createSignWithKeypair,
} from '@kadena/client';
import { describeModule } from '@kadena/client-utils/built-in';
import { transfer } from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';
import chalk from 'chalk';
import type { Command } from 'commander';
import { Option } from 'commander';
import debug from 'debug';
import { z } from 'zod';
import { FAUCET_MODULE_NAME } from '../../constants/devnets.js';
import type { IAccount } from '../../devnet/faucet/deploy/constants.js';
import {
  GAS_STATIONS,
  SENDER_00,
} from '../../devnet/faucet/deploy/constants.js';
import deployDevNetFaucet from '../../devnet/faucet/deploy/index.js';
import { networkIsAlive } from '../../devnet/utils/network.js';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import { loadNetworkConfig } from '../../networks/utils/networkHelpers.js';
import { actionAskForDeployDevnet } from '../../prompts/genericActionPrompts.js';
import { networkSelectOnlyPrompt } from '../../prompts/network.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { getAccountDetailsForAddAccount } from '../utils/getAccountDetails.js';

const accountByNetWork: { [key: string]: IAccount } = {
  'fast-development': SENDER_00,
  development: SENDER_00,
  testnet04: SENDER_00,
};

const FAUCET_ACCOUNT = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';

export async function fund(config: {
  accountName: string;
  amount: string;
  fungible: string;
  networkConfig: INetworkCreateOptions;
  chainId: ChainId;
}): Promise<CommandResult<string>> {
  const isDevNet = config.networkConfig.networkId === 'fast-development';
  try {
    const isAccountExist = await getAccountDetailsForAddAccount({
      accountName: config.accountName,
      chainId: config.chainId,
      networkId: config.networkConfig.networkId,
      networkHost: config.networkConfig.networkHost,
      fungible: config.fungible,
    });

    if (!isAccountExist) {
      return {
        success: false,
        errors: [`Account "${config.accountName}" does not exist.`],
      };
    }

    const keyPair = genKeyPair();

    const faucetAccount = isDevNet
      ? accountByNetWork[config.networkConfig.networkId]
      : {
          ...keyPair,
          accountName: GAS_STATIONS.TEST_NET,
        };

    const gasPayerAccount = isDevNet
      ? faucetAccount
      : {
          accountName: GAS_STATIONS.TEST_NET,
          publicKey: FAUCET_ACCOUNT,
        };

    const result = await transfer(
      {
        sender: {
          account: faucetAccount.accountName,
          publicKeys: [faucetAccount.publicKey],
        },
        receiver: config.accountName,
        amount: config.amount,
        chainId: config.chainId,
        contract: config.fungible,
        gasPayer: {
          account: gasPayerAccount.accountName,
          publicKeys: [gasPayerAccount.publicKey],
        },
      },
      {
        host: config.networkConfig.networkHost,
        sign: createSignWithKeypair({
          publicKey: faucetAccount.publicKey,
          secretKey: faucetAccount.secretKey,
        }),
        defaults: {
          networkId: config.networkConfig.networkId,
          meta: { chainId: config.chainId },
        },
      },
    ).execute();

    console.log(result);
    return {
      success: true,
      data: 'Write succeeded',
    };
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      errors: [error.message],
    };
  }
}

const networkSelect = createOption({
  key: 'network' as const,
  prompt: networkSelectOnlyPrompt,
  validation: z.string(),
  option: new Option(
    '-n, --network <network>',
    'Kadena network (e.g. "mainnet")',
  ),
  expand: async (network: string) => {
    try {
      const networkConfig = loadNetworkConfig(network);
      if (networkConfig.networkId === 'mainnet01') {
        throw new Error(`${networkConfig.networkId}:unsupported network`);
      }
      return networkConfig;
    } catch (e) {
      if (e.message.includes('unsupported network') === true) {
        const networkId = e.message.split(':')[0];
        throw new Error(
          `Network "${network}" of id "${networkId}" is not supported. Please select a different network.`,
        );
      }
      throw new Error(
        `No network configuration found for "${network}". Please create a "${network}" network.`,
      );
    }
  },
});

/* bin/kadena-cli.js account fund --account-name="k:f092d630fececf5c412815bc08831904bf36a5f034e6c99f548026eb447cf01f" --amount="1" --fungible="coin" --network="devnet" --chain-id="1" */

export const createFundCommand: (program: Command, version: string) => void =
  createCommand(
    'fund',
    'fund account',
    [
      globalOptions.accountName(),
      globalOptions.amount(),
      globalOptions.fungible(),
      networkSelect(),
      globalOptions.chainId(),
    ],
    async (config) => {
      debug('account-fund:action')({ config });

      if (config.networkConfig.networkId === 'mainnet01') {
        console.log(
          chalk.red(
            `\nNetwork "${config.network}" of id "${config.networkConfig.networkId}" is not supported.\n`,
          ),
        );
        return;
      }

      if (config.networkConfig.networkId === 'fast-development') {
        if (!(await networkIsAlive(config.networkConfig.networkHost))) {
          console.log(
            chalk.red(
              `\nHost "${config.networkConfig.networkHost}" is not running.\n`,
            ),
          );
          return;
        }

        const hasModuleAvailable = await describeModule(FAUCET_MODULE_NAME, {
          host: config.networkConfig.networkHost,
          defaults: {
            networkId: config.networkConfig.networkId,
            meta: { chainId: config.chainId },
          },
        }).catch(() => false);

        if (hasModuleAvailable === false) {
          console.log(
            chalk.red(
              `\nFaucet module is not available on chain "${config.chainId}" in "${config.network}".\n`,
            ),
          );
          const deployDevNetPrompt = await actionAskForDeployDevnet();

          if (deployDevNetPrompt === 'no') {
            return;
          }

          await deployDevNetFaucet([config.chainId])
            .then(() => {
              console.log(
                chalk.green(
                  `\nDeployed faucet module on chain "${config.chainId}" in "${config.network}".\n`,
                ),
              );
            })
            .catch((e) => {
              console.error(e);
              console.log(
                chalk.red(
                  `\nFailed to deploy faucet module on chain "${config.chainId}" in "${config.network}".\n`,
                ),
              );
              throw Error(e);
            });
        }
      }

      const result = await fund(config);

      assertCommandError(result);

      console.log(
        chalk.green(
          `${config.accountName} has been funded with ${config.amount} ${config.fungible} on chain ${config.chainId} in ${config.networkConfig.networkId} network.`,
        ),
      );
    },
  );
