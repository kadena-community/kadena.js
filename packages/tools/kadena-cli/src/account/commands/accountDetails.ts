import type { ChainId } from '@kadena/types';
import type { Table } from 'cli-table3';
import { CHAIN_ID_ACTION_ERROR_MESSAGE } from '../../constants/account.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import {
  isNotEmptyObject,
  maskStringPreservingStartAndEnd,
  notEmpty,
} from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { createTable } from '../../utils/table.js';
import { accountOptions } from '../accountOptions.js';
import type { IAccountDetailsResult } from '../types.js';
import type { IGetAccountDetailsParams } from '../utils/getAccountDetails.js';
import { getAccountDetailsFromChain } from '../utils/getAccountDetails.js';

interface IAccountDetailsConfig
  extends Omit<IGetAccountDetailsParams, 'chainId'> {
  chainIds: ChainId[];
}

interface IAccountDetails {
  [key: string]: IAccountDetailsResult;
}

const formatWarnings = (warnings: string[]): string | null => {
  if (warnings.length === 0) return null;
  const [prefix, suffix, ...chainIds] = warnings;
  const sortedChainIds = chainIds.sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10),
  );
  return `${prefix} ${sortedChainIds.join(',')} ${suffix}`;
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
      config.chainIds.map(async (chainId) => {
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
                `\nAccount "${config.accountName}" is not available on\nfollowing chain(s):`,
              );
              warnings.push(`on network "${config.networkId}"`);
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
    warnings: [formatWarnings(warnings)].filter(notEmpty),
  };
}

function generateTableForAccountDetails(accounts: IAccountDetails[]): Table {
  const table = createTable({
    head: ['Account Name', 'ChainID', 'Public Keys', 'Predicate', 'Balance'],
  });

  const data = accounts.map((acc) => {
    const chainId = Object.keys(acc)[0];
    const account = acc[chainId];
    const balance =
      typeof account.balance === 'object' && 'decimal' in account.balance
        ? account.balance.decimal.toString()
        : account.balance.toString();
    return [
      maskStringPreservingStartAndEnd(account.account, 32),
      chainId,
      account.guard.keys.map((key) => key).join('\n'),
      account.guard.pred,
      balance,
    ];
  });

  table.push(...data);

  return table;
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

    if (!isNotEmptyObject(accountConfig)) {
      fungible = (await option.fungible()).fungible;
    }

    const { networkConfig } = await option.network();
    const { chainIds } = await option.chainIds();

    if (chainIds === undefined || chainIds.length === 0) {
      log.error(CHAIN_ID_ACTION_ERROR_MESSAGE);
      return;
    }

    log.debug('account-details:action', {
      account,
      accountConfig,
      chainIds,
      networkConfig,
      fungible,
    });

    const result = await accountDetails({
      accountName: accountName,
      chainIds: chainIds,
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
      log.output(table.toString(), result.data);
    }
    assertCommandError(result);
  },
);
