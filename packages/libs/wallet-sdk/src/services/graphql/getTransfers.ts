import { createClient, fetchExchange } from '@urql/core';
import type {
  ITransferOptions,
  ITransferResponse,
} from '../../sdk/interface.js';
import { isEmpty } from '../../utils/typeUtils.js';
import { ACCOUNT_TRANSFER_QUERY } from './transfer.query.js';
import type { GqlTransfer } from './transfer.util.js';
import { parseGqlTransfers } from './transfer.util.js';

async function fetchTransfers(graphqlUrl: string, options: ITransferOptions) {
  const client = createClient({ url: graphqlUrl, exchanges: [fetchExchange] });
  if (options.first === undefined && options.last === undefined) {
    options.first = 100;
  }
  const result = await client
    .query(ACCOUNT_TRANSFER_QUERY, {
      accountName: options.accountName,
      fungibleName: options.fungibleName,
      first: options.first,
      last: options.last,
      before: options.before,
      after: options.after,
    })
    .toPromise();

  if (!result.data || !result.data.fungibleAccount) {
    // TODO: throw error instead?
    return {
      transfers: [],
      pageInfo: { hasNextPage: false, hasPreviousPage: false },
      lastBlockHeight: BigInt(0),
    };
  }

  const transfers = result.data.fungibleAccount.transfers.edges.map(
    (edge) => edge.node as GqlTransfer,
  );
  return {
    transfers,
    pageInfo: result.data.fungibleAccount.transfers.pageInfo,
    lastBlockHeight: !isEmpty(result.data?.lastBlockHeight)
      ? BigInt(result.data.lastBlockHeight)
      : null,
  };
}

// Currently queries all chains
export async function getTransfers(
  graphqlUrl: string,
  options: ITransferOptions,
): Promise<ITransferResponse> {
  const {
    transfers: nodes,
    pageInfo,
    lastBlockHeight,
  } = await fetchTransfers(graphqlUrl, options);
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
