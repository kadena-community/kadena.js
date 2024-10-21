import type {
  ChainId,
  IClient,
  ICommandResult,
  IUnsignedCommand,
} from '@kadena/client';
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

async function kdnResolver(
  identifier: string,
  networkId: string,
  networkHost: string,
  subject: 'address' | 'name',
): Promise<string | undefined> {
  try {
    const module = networkId.includes('testnet')
      ? KADENANAMES_NAMESPACE_TESTNET_MODULE
      : KADENANAMES_NAMESPACE_MAINNET_MODULE;

    const param =
      subject === 'address'
        ? ensureKdaExtension(identifier.trim())
        : identifier.trim();

    let transaction: IUnsignedCommand | undefined;

    if (subject === 'address') {
      transaction = Pact.builder
        .execution(`(${module}.get-address "${param}")`)
        .setMeta({ chainId })
        .setNetworkId(networkId)
        .createTransaction();
    } else if (subject === 'name') {
      transaction = Pact.builder
        .execution(`(${module}.get-name "${param}")`)
        .setMeta({ chainId })
        .setNetworkId(networkId)
        .createTransaction();
    }

    if (!transaction) {
      throw new Error(`Failed to create transaction for ${subject}`);
    }

    const response: ICommandResult = await client({
      networkId,
      networkHost,
    }).dirtyRead(transaction);

    return parseChainResponse<string>(response, subject);
  } catch (error) {
    return undefined;
  }
}

export async function nameToAddress(
  name: string,
  networkId: string,
  networkHost: string,
): Promise<string | undefined> {
  return kdnResolver(name, networkId, networkHost, 'address');
}

export async function addressToName(
  address: string,
  networkId: string,
  networkHost: string,
): Promise<string | undefined> {
  return kdnResolver(address, networkId, networkHost, 'name');
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
