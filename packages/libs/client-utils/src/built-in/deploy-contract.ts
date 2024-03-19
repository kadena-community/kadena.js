import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';

import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';

/**
 * @alpha
 */
export interface ITransactionBody {
  chainId: ChainId;
  networkId: string;
  signers: string[];
  meta: {
    gasLimit: number;
    chainId: ChainId;
    ttl: number;
    senderAccount: string;
  };
  data?: { key: string; value: string };
  keysets?: { name: string; pred: string; keys: string[] }[];
}

interface IDeployContractInput {
  contractCode: string;
  transactionBody: ITransactionBody;
}

/**
 * @alpha
 */
export const createPactCommandFromTransaction = (
  inputs: IDeployContractInput,
) => {
  const { contractCode, transactionBody } = inputs;
  let transactionBuilder = Pact.builder
    .execution(contractCode)
    .setMeta(transactionBody.meta)
    .setNetworkId(transactionBody.networkId);

  transactionBuilder = transactionBody.signers.reduce((builder, signer) => {
    return builder.addSigner(signer);
  }, transactionBuilder);

  if (transactionBody.keysets) {
    transactionBuilder = transactionBody.keysets.reduce((builder, keyset) => {
      return builder.addKeyset(keyset.name, keyset.pred, ...keyset.keys);
    }, transactionBuilder);
  }

  if (transactionBody.data) {
    transactionBuilder = transactionBuilder.addData(
      transactionBody.data.key,
      transactionBody.data.value,
    );
  }

  return transactionBuilder.getCommand();
};

/**
 * Deploy contract to the chain
 * @alpha
 * @param inputs - The inputs for the deployment
 * @param config - The client configuration for the deployment
 * @example
 * ```typescript
 * import { deployContract } from '@kadena/client-utils';
 *
 * const contractCode = `(coin.transfer "sender" "receiver" 100)`
 *
 * const transactionBody = {
 *    chainId: '0',
 *    networkId: 'network',
 *    signers: [' sender'],
 *    meta: {
 *      gasLimit: 800,
 *      chainId: '0',
 *      ttl: 10000,
 *      senderAccount: 'senderAccount',
 *    },
 * };
 *
 * deployContract(
 *  {
 *    contractCode,
 *    transactionBody,
 *  },
 *  clientConfig,
 * );
 * ```
 * @returns The result of the deployment
 */
export const deployContract = (
  inputs: IDeployContractInput,
  config: IClientConfig,
) => submitClient(config)(createPactCommandFromTransaction(inputs));
