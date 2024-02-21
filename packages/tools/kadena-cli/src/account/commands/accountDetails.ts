import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
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

export const createAccountDetailsCommand = createCommandFlexible(
  'details',
  'Get details of an account',
  [
    globalOptions.accountSelect(),
    globalOptions.networkSelect(),
    globalOptions.chainId({ isOptional: false }),
    globalOptions.fungible({ isOptional: true }),
  ],
  async (option, values) => {
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

    log.info(log.color.green(`\nDetails of account "${account}":\n`));
    log.info(log.color.green(`${JSON.stringify(result.data, null, 2)}`));
  },
);
