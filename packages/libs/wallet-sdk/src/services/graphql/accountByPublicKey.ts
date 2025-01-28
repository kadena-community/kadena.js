import { createClient, fetchExchange } from '@urql/core';
import type {
  IFungibleAccountsOptions,
  IFungibleAccountsResponse,
} from '../../sdk/interface.js';

import { ACCOUNTS_BY_PUBLIC_KEY_QUERY } from './account.query.js';

/**
 * Service to fetch fungible accounts by public key.
 *
 * @param graphqlUrl - The GraphQL endpoint URL.
 * @param options - Options containing publicKey and fungibleName.
 * @returns A promise resolving to IFungibleAccountsResponse.
 */
export async function fetchAccountsByPublicKey(
  graphqlUrl: string,
  options: IFungibleAccountsOptions,
): Promise<IFungibleAccountsResponse> {
  const client = createClient({ url: graphqlUrl, exchanges: [fetchExchange] });
  const result = await client
    .query(ACCOUNTS_BY_PUBLIC_KEY_QUERY, {
      publicKey: options.publicKey,
      fungibleName: options.fungibleName,
    })
    .toPromise();

  if (result.error) {
    throw new Error(`GraphQL Error: ${result.error.message}`);
  }

  if (!result.data) {
    throw new Error('No data returned from GraphQL query.');
  }

  if (result.data.fungibleAccountsByPublicKey.length === 0) {
    return {
      fungibleAccounts: [],
    };
  }

  return {
    fungibleAccounts: result.data.fungibleAccountsByPublicKey,
  };
}
