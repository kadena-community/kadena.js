export interface Transaction {
  fromAccount: string;
  height: number;
  amount: string;
  crossChainId?: number;
  toAccount: string;
  blockTime: string;
  requestKey: string;
  token: string;
  blockHash: string;
  idx: number;
  chain: number;
  crossChainAccount?: string;
}

export async function getTransactions(options: {
  chain: string;
  account: string;
}): Promise<Transaction[]> {
  const { chain, account } = options;

  try {
    const result: Transaction[] = await fetch(
      `https://estats.testnet.chainweb.com/txs/account/${account}?token=coin&chain=${chain}&limit=10`,
    ).then((res) => res.json());

    return result;
  } catch (error) {
    console.log(error);
  }

  return [];
}
