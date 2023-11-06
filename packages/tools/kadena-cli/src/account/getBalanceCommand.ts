import { getBalance } from '@kadena/client-utils/coin';
import { createCommand } from '../utils/createCommand.js';
import { globalOptions } from '../utils/globalOptions.js';

// eslint-disable-next-line @rushstack/typedef-var
export const createGetBalanceCommand = createCommand(
  'get-balance',
  'get the balance of an account',
  [globalOptions.account(), globalOptions.network(), globalOptions.chainId()],
  async (config) => {
    const balance = await getBalance(
      config.account,
      config.networkConfig.networkId,
      config.chainId,
      config.networkConfig.networkHost,
    );
    console.log({ balance });
    return balance;
  },
);
