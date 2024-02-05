import type { ChainId } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import { v4 as uuidv4 } from 'uuid';
import type { PactValue } from '../../../../libs/types/dist/types';
import { env } from './env';

export const createProofOfUsID = () => {
  return uuidv4();
};

export const getToken = async (tokenId: string): Promise<PactValue | null> => {
  const chainId = env.CHAINID as ChainId;
  const networkId = env.NETWORKID;
  if (!chainId || !networkId) return false;

  const client = createClient(
    `http://localhost:8080/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  );

  const transaction = Pact.builder
    .execution(`(marmalade-v2.ledger.get-token-info "${tokenId}")`)
    .setNetworkId(networkId)
    .setMeta({
      chainId,
    })

    .createTransaction();

  const result = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.result.status === 'success'
    ? (result.result.data as string)
    : null;
};
