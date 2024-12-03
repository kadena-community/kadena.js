import { createClient, fetchExchange } from '@urql/core';
import type { Transfer } from '../../sdk/interface.js';
import { TRANSFER_QUERY } from './transfer.query.js';
import type { GqlTransfer } from './transfer.util.js';
import { parseGqlTransfers } from './transfer.util.js';

async function fetchTransfers(
  graphqlUrl: string,
  accountName: string,
  fungibleName?: string,
) {
  const client = createClient({ url: graphqlUrl, exchanges: [fetchExchange] });
  const result = await client
    .query(TRANSFER_QUERY, { accountName, fungibleName })
    .toPromise();

  const nodes = result.data?.fungibleAccount?.transfers.edges.map(
    (edge) => edge.node as GqlTransfer,
  );

  return {
    transfers: nodes ?? [],
    lastBlockHeight: (result.data?.lastBlockHeight ?? null) as number | null,
  };
}

// Currently queries all chains
export async function getTransfers(
  graphqlUrl: string,
  accountName: string,
  fungibleName?: string,
): Promise<Transfer[]> {
  const { transfers: nodes, lastBlockHeight } = await fetchTransfers(
    graphqlUrl,
    accountName,
    fungibleName,
  );
  return parseGqlTransfers(
    nodes,
    lastBlockHeight ?? 0,
    accountName,
    fungibleName,
  );
}
