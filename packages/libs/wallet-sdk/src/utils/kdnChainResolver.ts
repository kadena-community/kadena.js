import type { ChainId, IClient, ICommandResult } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import {
  KADENANAMES_NAMESPACE_MAINNET_MODULE,
  KADENANAMES_NAMESPACE_TESTNET_MODULE,
} from '../constants/kdn.js';

// kadenanames running on chain 15
const chainId: ChainId = '15';

export function ensureKdaExtension(name: string): string {
  const lowerCaseName = name.toLowerCase();
  if (!lowerCaseName.endsWith('.kda')) {
    return `${lowerCaseName}.kda`;
  }
  return lowerCaseName;
}

const client = ({
  networkId,
  networkHost,
}: {
  networkId: string;
  networkHost: string;
}): IClient =>
  createClient(
    `${networkHost}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  );

// The type generation should no longer happen in node modules
export async function kdnResolveNameToAddress(
  name: string,
  networkId: string,
  networkHost: string,
): Promise<string | undefined> {
  try {
    const module = networkId.includes('testnet')
      ? KADENANAMES_NAMESPACE_TESTNET_MODULE
      : KADENANAMES_NAMESPACE_MAINNET_MODULE;
    const transaction = Pact.builder
      .execution(
        Pact.modules[module]['get-address'](ensureKdaExtension(name.trim())),
      )
      .setMeta({ chainId })
      .setNetworkId(networkId)
      .createTransaction();

    const response: ICommandResult = await client({
      networkId,
      networkHost,
    }).dirtyRead(transaction);

    return parseChainResponse<string>(response, 'address');
  } catch (error) {
    return undefined;
  }
}

// The type generation should no longer happen in node modules
export async function kdnResolveAddressToName(
  address: string,
  networkId: string,
  networkHost: string,
): Promise<string | undefined> {
  try {
    const module = networkId.includes('testnet')
      ? KADENANAMES_NAMESPACE_TESTNET_MODULE
      : KADENANAMES_NAMESPACE_MAINNET_MODULE;
    const transaction = Pact.builder
      .execution(Pact.modules[module]['get-name'](address.trim()))
      .setMeta({ chainId })
      .setNetworkId(networkId)
      .createTransaction();

    const response: ICommandResult = await client({
      networkId,
      networkHost,
    }).dirtyRead(transaction);

    return parseChainResponse<string>(response, 'name');
  } catch (error) {
    return undefined;
  }
}

function parseChainResponse<T>(response: ICommandResult, subject: string): T {
  if (response.result?.status === 'success') {
    return response.result.data as T;
  } else if (response.result?.status === 'failure') {
    const errorMessage = `Failed to retrieve ${subject}: ${JSON.stringify(
      response.result.error,
    )}`;
    throw new Error(errorMessage);
  }
  throw new Error(`Failed to retrieve ${subject}: Unknown error`);
}
