import { createClient, fetchExchange } from '@urql/core';
import type {
  ITransferOptions,
  ITransferResponse,
} from '../../sdk/interface.js';
import { ACCOUNT_CHAIN_TRANSFER_QUERY } from './transfer.query.js';
import type { GqlTransfer } from './transfer.util.js';
import { parseGqlTransfers } from './transfer.util.js';

async function fetchChainTransfers(
  graphqlUrl: string,
  options: ITransferOptions,
) {
  const client = createClient({ url: graphqlUrl, exchanges: [fetchExchange] });
  const result = await client
    .query(ACCOUNT_CHAIN_TRANSFER_QUERY, {
      accountName: options.accountName,
      fungibleName: options.fungibleName,
      chainId: options.chainId,
      first: options.first,
      last: options.last,
      before: options.before,
      after: options.after,
    })
    .toPromise();

  if (!result.data || !result.data.transfers) {
    // TODO: throw error instead?
    return {
      transfers: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      lastBlockHeight: BigInt(0),
    };
  }

  const nodes = result.data.transfers.edges.map(
    (edge) => edge.node as GqlTransfer,
  );

  return {
    transfers: nodes,
    pageInfo: result.data.transfers.pageInfo,
    lastBlockHeight: (result.data.lastBlockHeight ?? null) as bigint | null,
  };
}

// Currently queries all chains
export async function getChainTransfers(
  graphqlUrl: string,
  options: ITransferOptions,
): Promise<ITransferResponse> {
  const {
    transfers: nodes,
    pageInfo,
    lastBlockHeight,
  } = await fetchChainTransfers(graphqlUrl, options);
  console.log('nodes>>', nodes);
  const transfers = parseGqlTransfers(
    nodes,
    lastBlockHeight ?? BigInt(0),
    options.fungibleName,
  );
  return {
    transfers,
    pageInfo: {
      hasNextPage: pageInfo.hasNextPage,
      hasPreviousPage: pageInfo.hasPreviousPage,
      startCursor: pageInfo.startCursor ?? null,
      endCursor: pageInfo.endCursor ?? null,
    },
  };
}
