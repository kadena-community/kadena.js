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
  keysets?: { name: string; pred: string; keys: string[] }[];
  namespace?: { key: string; data: string };
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

  if (transactionBody.namespace) {
    transactionBuilder = transactionBuilder.addData(
      transactionBody.namespace.key,
      transactionBody.namespace.data,
    );
  }

  return transactionBuilder.getCommand();
};

export const deployContract = (
  inputs: IDeployContractInput,
  config: IClientConfig,
) => submitClient(config)(createPactCommand(inputs));

// export const deployContractCommand1 = async (inputs: IDeployContractInput) => {
//   const { contractCode, transactionBody } = inputs;

//   // Create an array of functions for adding keysets
//   const keysetFunctions = transactionBody.keysets.map((keyset) => {
//     return (command: any) =>
//       command.addKeyset(keyset.name, keyset.pred, ...keyset.keys);
//   });

//   let transactionBuilder = composePactCommand(
//     execution(contractCode),
//     setMeta(transactionBody.meta),
//     setNetworkId(transactionBody.networkId),
//     addSigner(
//       transactionBody.signers.map((signer) => signer.publicKey),
//       (signFor) => [signFor('coin.GAS')],
//     ),
//     ...keysetFunctions,
//   );

//   transactionBuilder = transactionBody.signers.reduce((builder, signer) => {
//     return builder.addSigner(signer.publicKey);
//   }, transactionBuilder);
// };
