import { prepareContCommand, prepareExecCommand } from 'kadena.js';

import {
  ChainwebChainId,
  EnvData,
  ICommand,
  IKeyPair,
  IMetaData,
  NetworkId,
  PactTransactionHash,
  Proof,
} from '@kadena/types';

export function createSampleExecTx(
  keyPair: IKeyPair,
  pactCode: string,
  network?: NetworkId,
  envData?: EnvData,
): ICommand {
  const nonce: string = 'step01';
  const meta: IMetaData = {
    creationTime: Math.round(new Date().getTime() / 1000) - 1,
    ttl: 28800,
    gasLimit: 10000,
    chainId: '0',
    gasPrice: 0.00001,
    sender: `k:${keyPair.publicKey}`,
  };
  return prepareExecCommand([keyPair], nonce, pactCode, meta, network, envData);
}

export function createSampleContTx(
  network: NetworkId,
  keyPair: IKeyPair,
  pactId: PactTransactionHash,
  envData: EnvData,
  proof: Proof,
  targetChainId: ChainwebChainId,
): ICommand {
  const nonce: string = 'step02';
  const meta: IMetaData = {
    creationTime: Math.round(new Date().getTime() / 1000) - 1,
    ttl: 28800,
    gasLimit: 10000,
    chainId: targetChainId,
    gasPrice: 0.00001,
    sender: `k:${keyPair.publicKey}`,
  };
  const step = 1;
  const rollback = false;
  return prepareContCommand(
    [keyPair],
    nonce,
    proof,
    pactId,
    rollback,
    step,
    meta,
    network,
    envData,
  );
}
