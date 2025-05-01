import { Pact, createClient } from '@kadena/client';
import { ChainId } from '@kadena/wallet-adapter-core';

interface ChainResponse {
  account: string;
  guard: { pred: string; keys: string[] };
}

export const formatChainResponse = (data: any): ChainResponse => {
  return { account: data.account, guard: data.guard };
};

export const checkVerifiedAccount = async (
  accountName: string,
  chainIds: ChainId[],
  tokenContract: string,
  networkId: string,
): Promise<{
  status: string;
  message: string;
  data: ChainResponse | undefined;
}> => {
  const client = createClient();

  for (const chainId of chainIds) {
    try {
      const query = Pact.builder
        .execution(`(${tokenContract}.details (read-msg 'account))`)
        .setMeta({ chainId, senderAccount: accountName })
        .setNetworkId(networkId)
        .addData('account', accountName)
        .createTransaction();

      const { result } = await client.dirtyRead(query);
      console.log(`Chain ${chainId}:`, result);

      if (result.status === 'success') {
        return {
          status: 'success',
          message: `Account found on chain ${chainId}`,
          data: formatChainResponse(result.data),
        };
      }
    } catch (e: any) {
      console.warn(`Error checking account on chain ${chainId}:`, e.message);
      // Continue to next chain
    }
  }

  return {
    status: 'failure',
    message: 'Account not found on any provided chain',
    data: undefined,
  };
};
