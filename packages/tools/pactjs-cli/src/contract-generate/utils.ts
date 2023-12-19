export function extractNetworkAndChain(api?: string): {
  network?: string;
  chain?: number;
} {
  if (api === undefined) return {};
  const network = api.match(/\/chainweb\/\d+\.\d+\/(\w+)\//)?.[1];
  const chain = api.match(/\/chain\/(\d+)\//)?.[1];
  return {
    network,
    chain: chain !== undefined ? parseInt(chain, 10) : undefined,
  };
}
