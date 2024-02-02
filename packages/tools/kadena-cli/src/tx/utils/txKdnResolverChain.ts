import type { ChainId, IClient, ICommandResult } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';

interface INameToAddressResponse {
  address: string;
}
interface IAddressToNameResponse {
  name: string;
}

const client = (networkId: string, chainId: ChainId): IClient =>
  createClient(`${networkId}/chainweb/0.0/${networkId}/chain/${chainId}/pact`);

export async function kdnResolveNameToAddress(
  name: string,
  networkId: string,
  chainId: ChainId,
): Promise<string | undefined> {
  try {
    const transaction = Pact.builder
      .execution(
        Pact.modules['n_32faa22a75da53789d48dcbcb124a11c8f8651a8.kadena-names'][
          'get-address'
        ](name),
      )
      .setMeta({ chainId: chainId })
      .setNetworkId(networkId)
      .createTransaction();

    const response: ICommandResult = await client(networkId, chainId).local(
      transaction,
      {
        preflight: false,
        signatureVerification: false,
      },
    );

    const data = parseChainResponse<INameToAddressResponse>(
      response,
      'address',
    );
    if (data.address === null) {
      return undefined;
    }
    return data.address;
  } catch (error) {
    console.error('Error in kdnResolveNameToAddress:', error);
    throw error;
  }
}

export async function kdnResolveAddressToName(
  address: string,
  networkId: string,
  chainId: ChainId,
): Promise<string | undefined> {
  try {
    const transaction = Pact.builder
      .execution(
        Pact.modules['n_32faa22a75da53789d48dcbcb124a11c8f8651a8.kadena-names'][
          'get-name'
        ](address),
      )
      .setMeta({ chainId: chainId })
      .setNetworkId(networkId)
      .createTransaction();

    const response: ICommandResult = await client(networkId, chainId).local(
      transaction,
      {
        preflight: false,
        signatureVerification: false,
      },
    );

    const data = parseChainResponse<IAddressToNameResponse>(response, 'name');
    if (data.name === null) {
      return undefined;
    }
    return data.name;
  } catch (error) {
    console.error('Error in kdnResolveAddressToName:', error);
    throw error;
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
