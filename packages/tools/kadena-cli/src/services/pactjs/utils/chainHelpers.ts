import type { IContractGenerateOptions } from '../pactjs.types.js';

export function getChainId(url: string): string {
  const parts = url.split('/');
  const chainIndex = parts.indexOf('chain') + 1;
  const chainId = parts[chainIndex];

  return chainId;
}

export function getAPIUrl(args: IContractGenerateOptions): string | undefined {
  if (args.api !== undefined && args.api.trim() !== '') {
    return args.api;
  }

  if (args.networkConfig?.networkHost !== undefined) {
    return `${args.networkConfig.networkHost}/chainweb/0.0/${args.networkConfig.networkId}/chain/${args.chainId}/pact`;
  }

  return undefined;
}
