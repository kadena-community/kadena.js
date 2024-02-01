import type { ChainId } from '@kadena/client';
import {
  Pact,
  createClient,
  isSignedTransaction,
  signWithChainweaver,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { v4 as uuidv4 } from 'uuid';
import { env } from './env';

export const createProofOfUsID = () => {
  return uuidv4();
};

export const createTokenId = async () => {
  // const namespace = env.NAMESPACE;
  // const chainId: ChainId = env.CHAINID;
  // const networkId = env.NETWORKID;
  // if (!chainId || !networkId || !namespace) return;

  return 'testtoken';
};

export const getToken = async (
  proofOfUsId: string,
  account?: IAccount,
): Promise<boolean> => {
  if (!account) return false;
  //TODO: add marmalade pact to get the balance
  return false;
};
