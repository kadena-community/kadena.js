import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';

import { submitClient } from '../core';
import type { IClientConfig } from '../core/utils/helpers';

export interface ITransactionBodyInput {
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

export interface IDeployContractInput {
  contractCode: string;
  transactionBody: ITransactionBodyInput;
}

export const createPactCommand = (inputs: IDeployContractInput) => {
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

export const deployContract = (
  inputs: IDeployContractInput,
  config: IClientConfig,
) => submitClient(config)(createPactCommand(inputs));
