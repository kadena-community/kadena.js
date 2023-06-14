import { ChainwebChainId } from '@kadena/chainweb-node-client';
import { Pact, PactCommand } from '@kadena/client';

import { generateApiHost } from '../utils/utils';

export const isExistingAccount = async (
  account: string,
  chainId: ChainwebChainId,
) => {
  // try {
  const response = await Pact.modules.coin['get-balance'](account).local(
    generateApiHost('testnet04', chainId),
    {
      preflight: false,
    },
  );

  console.log('isExistingAccount', { response });

  return response.result.status !== 'failure';
  // } catch (e) {
  //   console.error('isExistingAccount', e);
  // }

  // return false;
};
