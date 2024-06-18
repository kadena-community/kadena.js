export const GET_TOKENS_QUERY = `
  query GetTokens($accountName: String!) {
    nonFungibleAccount(accountName: $accountName) {
      accountName
      id
      nonFungibleTokenBalances {
        balance
        tokenId
        info {
          uri
        }
      }
    }
  }
`;