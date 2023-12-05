export function getTransfersQuery(accountName: string) {
  return {
    query: `query getTransfers($accountName: String!) {
      transfers(accountName: $accountName) {
        edges {
          cursor
          node {
            amount
            blockHash
            chainId
            height
            id
            moduleHash
            moduleName
            orderIndex
            receiverAccount
            requestKey
            senderAccount
            transaction {
              signers {
                address
                capabilities
                id
                orderIndex
                publicKey
                requestKey
                scheme
                signature
              }
              badResult
              code
              chainId
              continuation
              data
              creationTime
              eventCount
              gas
              gasPrice
              gasLimit
              height
              goodResult
              logs
              id
              metadata
              nonce
              pactId
              proof
              requestKey
              rollback
              senderAccount
              step
              transactionId
              ttl
            }
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
