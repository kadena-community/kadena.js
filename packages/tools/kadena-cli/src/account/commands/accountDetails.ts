import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { maskStringPreservingStartAndEnd } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import type { IAccountDetailsResult } from '../types.js';
import type { IGetAccountDetailsParams } from '../utils/getAccountDetails.js';
import { getAccountDetailsFromChain } from '../utils/getAccountDetails.js';

export async function accountDetails(
  config: IGetAccountDetailsParams,
): Promise<CommandResult<IAccountDetailsResult>> {
  try {
    const accountDetails = await getAccountDetailsFromChain({ ...config });
    return {
      success: true,
      data: accountDetails,
    };
  } catch (error) {
    if (error.message.includes('row not found') === true) {
      return {
        success: false,
        errors: [
          `Account "${config.accountName}" is not available on chain "${config.chainId}" of networkId "${config.networkId}"`,
        ],
      };
    }
    return {
      success: false,
      errors: [error.message],
    };
  }
}

function generateTableForAccountDetails(account: IAccountDetailsResult): {
  headers: string[];
  data: string[][];
} {
  const headers = ['Account Name', 'Public Keys', 'Predicate', 'Balance'];

  const data = [
    maskStringPreservingStartAndEnd(account.account, 32),
    account.guard.keys.map((key) => key).join('\n'),
    account.guard.pred,
    account.balance.toString(),
  ];

  return {
    headers,
    data: [data],
  };
}

export const createAccountDetailsCommand = createCommand(
  'details',
  'Get details of an account',
  [
    accountOptions.accountSelect(),
    globalOptions.networkSelect(),
    globalOptions.chainId({ isOptional: false }),
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

    assertCommandError(result);

    log.info(
      log.color.green(
        `\nDetails of account "${account}" on network "${networkConfig.networkId}" and chain "${chainId}" is:\n`,
      ),
    );
    const table = generateTableForAccountDetails(result.data);
    log.output(log.generateTableString(table.headers, table.data));
  },
);
