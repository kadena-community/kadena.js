import { getTransactionsByRequestKeyQuery } from '../testdata/queries/getTransactions';
import { sendQuery } from './request-util';

export async function getBlockHash(
  requestKey: string | undefined,
): Promise<string> {
  const query = getTransactionsByRequestKeyQuery(requestKey);
  const queryResult = await sendQuery(query);
  return queryResult.body.data.transactions.edges[0].node.block.hash;
}
