import { graphql } from '../../gql/gql.js';

export const ACCOUNTS_BY_PUBLIC_KEY_QUERY = graphql(`
  query accountsByPublicKey($publicKey: String!, $fungibleName: String) {
    fungibleAccountsByPublicKey(
      publicKey: $publicKey
      fungibleName: $fungibleName
    ) {
      accountName
      chainAccounts {
        accountName
        chainId
      }
    }
  }
`);
