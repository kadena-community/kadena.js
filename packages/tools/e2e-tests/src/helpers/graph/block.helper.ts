import { getTransactionsByRequestKeyQuery } from '@fixtures/graph/testdata/queries/getTransactions';
import { sendQuery } from '@helpers/graph/request.helper';
import type { APIRequestContext } from '@playwright/test';

export async function getBlockHash(
  request: APIRequestContext,
  requestKey: string | undefined,
): Promise<string> {
  const query = getTransactionsByRequestKeyQuery(requestKey);
  const queryResult = await sendQuery(request, query);
  return queryResult.transactions.edges[0].node.block.hash;
}
