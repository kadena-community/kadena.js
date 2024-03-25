import type { ChainId } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import {
  maskStringPreservingStartAndEnd,
  notEmpty,
} from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import type { IAccountDetailsResult } from '../types.js';
import type { IGetAccountDetailsParams } from '../utils/getAccountDetails.js';
import { getAccountDetailsFromChain } from '../utils/getAccountDetails.js';

interface IAccountDetailsConfig
  extends Omit<IGetAccountDetailsParams, 'chainId'> {
  chainId: ChainId[];
}

interface IAccountDetails {
  [key: string]: IAccountDetailsResult;
}

const formatWarnings = (warnings: string[]): string => {
  if (warnings.length === 0) return warnings.join(',');
  const [prefix, ...chainIds] = warnings;
  const sortedChainIds = chainIds.sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10),
  );
  return `${prefix} ${sortedChainIds.join(',')}`;
};

export async function accountDetails(
  config: IAccountDetailsConfig,
): Promise<CommandResult<IAccountDetails[]>> {
  let status: 'success' | 'error' | 'partial' = 'success';
  const errors: string[] = [];
  const warnings: string[] = [];
  let accountDetailsList: (IAccountDetails | null)[] = [];
  try {
    accountDetailsList = await Promise.all(
      config.chainId.map(async (chainId) => {
        try {
          const accountDetails = await getAccountDetailsFromChain({
            ...config,
            chainId,
          });
          return {
            [chainId]: accountDetails,
          };
        } catch (error) {
          if (error.message.includes('row not found') === true) {
            if (warnings.length === 0) {
              warnings.push(
                `\nAccount "${config.accountName}" is not available on\nfollowing chain(s) of the "${config.networkId}" network:`,
              );
            }
            warnings.push(chainId);
            return null;
          }

          status = 'partial';
          warnings.push(error.message);
          return null;
        }
      }),
    );
  } catch (error) {
    status = 'error';
    errors.push(error.message);
  }
  const nonEmptyAccountDetails = accountDetailsList.filter(notEmpty);
  status = nonEmptyAccountDetails.length === 0 ? 'error' : status;
  return {
    status,
    data: nonEmptyAccountDetails,
    errors,
    warnings: [formatWarnings(warnings)],
  };
}

function generateTableForAccountDetails(accounts: IAccountDetails[]): {
  headers: string[];
  data: string[][];
} {
  const headers = [
    'Account Name',
    'ChainID',
    'Public Keys',
    'Predicate',
    'Balance',
  ];

  const data = accounts.map((acc) => {
    const chainId = Object.keys(acc)[0];
    const account = acc[chainId];
    return [
      maskStringPreservingStartAndEnd(account.account, 32),
      chainId,
      account.guard.keys.map((key) => key).join('\n'),
      account.guard.pred,
      account.balance.toString(),
    ];
  });

  return {
    headers,
    data: data,
  };
}

export const createAccountDetailsCommand = createCommand(
  'details',
  'Get details of an account',
  [
    accountOptions.accountSelect(),
    globalOptions.networkSelect(),
    accountOptions.chainIdRange({ isOptional: false }),
    accountOptions.fungible({ isOptional: true }),
  ],
  async (option) => {
    const { account, accountConfig } = await option.account({
      isAllowManualInput: true,
    });

    let fungible = accountConfig?.fungible ?? 'coin';
    const accountName = accountConfig?.name ?? account;

    if (!accountConfig) {
      fungible = (await option.fungible()).fungible;
    }

    const { networkConfig } = await option.network();
    const { chainId } = await option.chainId();

    log.debug('account-details:action', {
      account,
      accountConfig,
      chainId,
      networkConfig,
      fungible,
    });

    const result = await accountDetails({
      accountName: accountName,
      chainId: chainId,
      networkId: networkConfig.networkId,
      networkHost: networkConfig.networkHost,
      fungible: fungible,
    });
    if (result.status === 'success') {
      log.info(
        log.color.green(
          `Details of account "${account}" on network "${networkConfig.networkId}"`,
        ),
      );
      const table = generateTableForAccountDetails(result.data);
      log.output(log.generateTableString(table.headers, table.data));
    }
    assertCommandError(result);
  },
);
