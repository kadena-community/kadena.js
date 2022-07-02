import {
  NetworkId,
  CommandPayload,
  Command,
  SignatureWithHash,
  KeyPair,
  MetaData,
  Proof,
  PactTransactionHash,
} from '@kadena/types';

import { prepareExecCommand } from '../src/api/prepareExecCommand';
import { prepareContCommand } from '../src/api/prepareContCommand';

export function createSampleExecTx(
  network: NetworkId,
  keyPair: KeyPair,
  pactCode: string,
  envData: object | null = null,
): Command {
  const nonce: string = 'step01';
  const meta: MetaData = {
    creationTime: Math.round(new Date().getTime() / 1000) - 1,
    ttl: 28800,
    gasLimit: 10000,
    chainId: '0',
    gasPrice: 0.00001,
    sender: 'k:'.concat(keyPair.publicKey),
  };
  return prepareExecCommand([keyPair], nonce, pactCode, envData, meta, network);
}

export function createSampleContTx(
  network: NetworkId,
  keyPair: KeyPair,
  pactId: PactTransactionHash,
  envData: object | null = null,
  proof: Proof,
): Command {
  const nonce: string = 'step02';
  const meta: MetaData = {
    creationTime: Math.round(new Date().getTime() / 1000) - 1,
    ttl: 28800,
    gasLimit: 10000,
    chainId: '0',
    gasPrice: 0.00001,
    sender: 'k:'.concat(keyPair.publicKey),
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
