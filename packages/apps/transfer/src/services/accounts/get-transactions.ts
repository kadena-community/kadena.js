export async function getTransactions(options: {
  chain: string;
  account: string;
}): Promise<any[]> {
  const { chain, account } = options;

  const result = await fetch(
    `https://estats.testnet.chainweb.com/txs/account/${account}?token=coin&chain=${chain}&limit=10`,
  ).then((res) => res.json());

  return [];
}
