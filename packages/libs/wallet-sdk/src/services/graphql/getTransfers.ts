import { createClient, fetchExchange } from '@urql/core';
import { graphql } from '../../gql/gql.js';
import type { Transfer } from '../../sdk/interface.js';

const accountTransfersQuery = graphql(`
  query accountTransfers($accountName: String!, $fungibleName: String) {
    fungibleAccount(accountName: $accountName, fungibleName: $fungibleName) {
      transfers(first: 100) {
        edges {
          node {
            amount
            block {
              hash
              creationTime
            }
            chainId
            crossChainTransfer {
              receiverAccount
              senderAccount
              chainId
              requestKey
              transaction {
                result {
                  ... on TransactionResult {
                    goodResult
                    badResult
                  }
                }
              }
            }
            transaction {
              result {
                ... on TransactionResult {
                  events {
                    edges {
                      node {
                        name
                        parameters
                      }
                    }
                  }
                  goodResult
                  badResult
                }
              }
            }
            senderAccount
            height
            orderIndex
            requestKey
            receiverAccount
          }
        }
      }
    }
  }
`);

// Currently queries all chains
export async function getTransfers(
  graphqlUrl: string,
  accountName: string,
  fungibleName?: string,
): Promise<Transfer[]> {
  const client = createClient({ url: graphqlUrl, exchanges: [fetchExchange] });
  const result = await client
    .query(accountTransfersQuery, { accountName, fungibleName })
    .toPromise();
  const nodes = result.data?.fungibleAccount?.transfers.edges.map(
    (edge) => edge.node,
  );

  if (!nodes) return [];

  return nodes?.map((node) => {
    return {
      amount: node.amount,
      chainId: node.chainId,
      requestKey: node.requestKey,
      senderAccount: node.senderAccount,
      receiverAccount: node.receiverAccount,
      success: true,
      token: fungibleName,
      isCrossChainTransfer: false,
    } as Transfer;
  });
}
