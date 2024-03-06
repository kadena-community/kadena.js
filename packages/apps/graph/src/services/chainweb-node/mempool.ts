export async function mempoolLookup(hash: string, chainId: string) {
  const res = await fetch(
    `https://localhost:1789/chainweb/0.0/fast-development/chain/${chainId}/mempool/lookup`,
    {
      method: 'POST',
      body: JSON.stringify([hash]),
    },
  );

  const data = await res.json();
  return data;
}
