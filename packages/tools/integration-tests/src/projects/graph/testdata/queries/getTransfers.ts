export function getTransfersQuery(accountName: string) {
  return {
    query: `query getTransfers($accountName: String!) {
      transfers(accountName: $accountName) {
        edges {
          node {I he
            amount
            chainId
            receiverAccount
            requestKey
            senderAccount
            id
          }
        }
        totalCount
      }
    }`,
    variables: { accountName: accountName },
    operationName: 'getTransfers',
    extensions: {},
  };
}
