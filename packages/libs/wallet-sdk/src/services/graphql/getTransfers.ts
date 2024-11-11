import { createClient, fetchExchange } from '@urql/core';
import { graphql } from '../../gql/gql.js';
import type { Transfer } from '../../sdk/interface.js';
import { parsePactNumber } from '../../utils/pact.util.js';
import { safeJsonParse } from '../../utils/string.util.js';
import { isEmpty, notEmpty } from '../../utils/typeUtils.js';

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
                  __typename
                  ... on TransactionResult {
                    goodResult
                    badResult
                  }
                }
              }
            }
            transaction {
              cmd {
                networkId
                signers {
                  clist {
                    name
                    args
                  }
                }
              }
              result {
                __typename
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

function parseClist(node: Nodes[0]) {
  if (isEmpty(node.transaction)) return [];
  const clist = node.transaction.cmd.signers.flatMap((x) =>
    x.clist
      .map((item) => {
        const args = safeJsonParse<(number | string | object)[]>(item.args);
        if (args === null) return null;
        return { name: item.name, args };
      })
      .filter(notEmpty),
  );
  return clist;
}

async function fetchTransfers(
  graphqlUrl: string,
  accountName: string,
  fungibleName?: string,
) {
  const client = createClient({ url: graphqlUrl, exchanges: [fetchExchange] });
  const result = await client
    .query(accountTransfersQuery, { accountName, fungibleName })
    .toPromise();
  const nodes = result.data?.fungibleAccount?.transfers.edges.map(
    (edge) => edge.node,
  );

  return nodes ?? [];
}

type Nodes = Awaited<ReturnType<typeof fetchTransfers>>;

const isSuccess = (node: Nodes[0]) =>
  node.transaction?.result.__typename === 'TransactionResult' &&
  Boolean(node.transaction.result.goodResult);

const nodeToTransfer = (node: Nodes[0], fungibleName?: string): Transfer => {
  return {
    amount: node.amount,
    chainId: node.chainId,
    requestKey: node.requestKey,
    senderAccount: node.senderAccount,
    receiverAccount: node.receiverAccount,
    success: isSuccess(node),
    token: fungibleName ?? 'coin',
    isCrossChainTransfer: false,
    networkId: node.transaction?.cmd.networkId!,
    transactionFeeTransfer: null,
  };
};

// Currently queries all chains
export async function getTransfers(
  graphqlUrl: string,
  accountName: string,
  fungibleName?: string,
): Promise<Transfer[]> {
  const nodes = await fetchTransfers(graphqlUrl, accountName, fungibleName);

  const grouped = nodes.reduce(
    (acc, node) => {
      const key = node.requestKey;
      if (!(key in acc)) acc[key] = [];
      acc[key].push(node);
      return acc;
    },
    {} as Record<string, typeof nodes>,
  );

  // TODO: work cases
  // [x] Simple same-chain transfer with 1 transfer and 1 gas fee
  // [ ] Safe transfer. show 2 transfers, and both link to the same gas fee
  // [ ] Cross-chain transfer
  return Object.values(grouped).flatMap((nodes) => {
    const transactionFee = nodes.find((node) => node.orderIndex === 0);
    const transfers = nodes.filter((node) => node.orderIndex > 0);

    if (isEmpty(transactionFee)) return [];

    // Failed transfers only have the transaction fee transfer
    // For wallets, give the transfer with original amount and receiver
    if (transfers.length === 0) {
      const gqlTransfer = nodes[0];

      if (isSuccess(gqlTransfer)) {
        console.log(
          'RequestKey found with one one Transfer, but it does not have failed status.',
        );
        return [];
      }

      // Reconstruct original transfer
      const clist = parseClist(gqlTransfer);
      const transferCap = clist.find((x) => x.name === 'coin.TRANSFER')?.args;
      if (isEmpty(transferCap)) return [];
      const transactionFeeTransfer = nodeToTransfer(gqlTransfer, fungibleName);
      const transfer: Transfer = {
        ...transactionFeeTransfer,
        receiverAccount: String(transferCap[1]),
        // Could technically be different from the value used in payload.code
        // It would be an improvement to parse code instead of using the cap, but that is very complex.
        amount: parsePactNumber(transferCap[2]),
        success: false,
        transactionFeeTransfer: {
          ...transactionFeeTransfer,
          isBulkTransfer: false,
          success: true,
        },
      };
      return [transfer];
    }

    return transfers.map(
      (node) =>
        ({
          ...nodeToTransfer(node, fungibleName),
          transactionFeeTransfer: {
            ...nodeToTransfer(transactionFee, fungibleName),
            isBulkTransfer: transfers.length > 1,
          },
        }) as Transfer,
    );
  });
}
