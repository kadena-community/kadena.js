import { ChainId, Pact } from '@kadena/client';
import { apiHostGenerator } from './utils/apiHostGenerator';

type Options<TSigned extends true | false> = {
  networkId: string;
  chainId: ChainId;
  senderAccount: TSigned extends true
    ? SenderAccountWithMultipleKeys | SenderAccountWithOneKey
    : undefined;
};

type SenderAccountWithOneKey = {
  key: string;
};

type SenderAccountWithMultipleKeys = {
  account?: string;
  keys: string[];
  predicate?: string;
};

export function createDoCrossChainTransfer(
  { networkId, chainId, senderAccount }: Options<true>,
  hostGeneratorFn = apiHostGenerator,
) {
  //@ts-ignore
  const client = createClient(hostGeneratorFn);
  //@ts-ignore
  return (from, to, targetChainId, onFirstFinished, onEvent) => {};
}

export function getBalance(
  { networkId, chainId }: Options<false>,
  hostGeneratorFn = apiHostGenerator,
) {
  //@ts-ignore
  const client = createClient(hostGeneratorFn);
  //@ts-ignore
  return async (account) => {
    Pact.builder
      .execution(Pact.modules.coin.details(account))
      .setNetworkId(networkId)
      .setMeta({ chainId });
    return '10.000123';
  };
}

