import type {
  ChainwebChainId,
  ILocalCommandResult,
} from '@kadena/chainweb-node-client';
import { createClient, Pact } from '@kadena/client';

import type { Network } from '@/constants/kadena';
import {
  getKadenaConstantByNetwork,
  kadenaConstants,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { getAllNetworks } from '@/utils/network';
import Debug from 'debug';

const debug = Debug('kadena-transfer:services:describe-module');

export const describeModule = async (
  moduleName: string,
  chainId: ChainwebChainId,
  network: Network,
  senderAccount: string = kadenaConstants.DEFAULT_SENDER,
  gasPrice: number = kadenaConstants.GAS_PRICE,
  gasLimit: number = kadenaConstants.GAS_LIMIT,
  ttl: number = kadenaConstants.API_TTL,
): Promise<ILocalCommandResult> => {
  debug(describeModule.name);
  const { networksData } = useWalletConnectClient();

  const networkDto = networksData.find((item) => item.networkId == network);

  if (!networkDto) {
    // @ts-ignore
    return;
  }

  const { local } = createClient(
    networkDto.apiHost({
      networkId: networkDto.networkId,
      chainId,
    }),
  );

  const transaction = Pact.builder
    .execution(`(describe-module "${moduleName}")`)
    .setMeta({ gasLimit, gasPrice, ttl, senderAccount, chainId })
    .setNetworkId(networkDto.networkId)
    .createTransaction();

  return await local(transaction, {
    preflight: false,
    signatureVerification: false,
  });
};
