import { Pact, createClient } from '@kadena/client';
import type { ChainId } from '@kadena/wallet-adapter-core';

interface IChainResponse {
  account: string;
  guard: { pred: string; keys: string[] };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatChainResponse = (data: any): IChainResponse => {
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
  data: IChainResponse | undefined;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface ResponseType {
  id: string;
  type: string;
  payload: unknown;
  error: unknown;
}

export const sleep = (time: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, time));

export const communicate =
  (client: Window, server: Window, walletOrigin: string) =>
  (type: string, payload: Record<string, unknown>): Promise<ResponseType> => {
    const id = crypto.randomUUID();
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data && event.data.id === id) {
          client.removeEventListener('message', handler);
          resolve(event.data);
          server.blur();
          window.focus();
        }
      };
      client.addEventListener('message', handler);
      server.postMessage({ payload, id, type }, walletOrigin);
    });
  };
