import { getTransactionsByRequestKeyQuery } from '@fixtures/graph/getTransactions';
import type { APIRequestContext } from '@playwright/test';
import { sendQuery } from 'src/support/helpers/graph/request.helper';

export async function getBlockHash(
  request: APIRequestContext,
  requestKey: string | undefined,
): Promise<string> {
  const query = getTransactionsByRequestKeyQuery(requestKey);
  const queryResult = await sendQuery(request, query);
  return queryResult.transactions.edges[0].node.block.hash;
}
