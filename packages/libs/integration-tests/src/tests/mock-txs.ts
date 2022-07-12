import {
  NetworkId,
  ICommand,
  IKeyPair,
  IMetaData,
  Proof,
  PactTransactionHash,
  EnvData,
  ChainwebChainId,
} from '@kadena/types';

import { prepareExecCommand } from 'kadena.js';
import { prepareContCommand } from 'kadena.js';

export function createSampleExecTx(
  network: NetworkId,
  keyPair: IKeyPair,
  pactCode: string,
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
  return prepareExecCommand([keyPair], nonce, pactCode, envData, meta, network);
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
    envData,
    meta,
    network,
  );
}
