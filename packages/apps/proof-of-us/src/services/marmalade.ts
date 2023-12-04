import type { ICommandResult } from '@kadena/client';
import { Pact, createClient, signWithChainweaver } from '@kadena/client';
import { getApiHost, getChainId, getNetworkId } from './config';

const client = createClient(getApiHost());

function parseResponse<T>(response: ICommandResult, subject: string): T {
  if (response.result?.status === 'success') {
    return response.result.data as unknown as T;
  } else if (response.result?.status === 'failure') {
    const errorMessage = `Failed to retrieve ${subject}: ${JSON.stringify(
      response.result.error,
    )}`;
    throw new Error(errorMessage);
  }
  throw new Error(`Failed to retrieve ${subject}: Unknown error`);
}

const guardPublicKey =
  'db601702162a84e6561d4cd6011c420b63c65214151cf4c40aeaf526abc3a5f9';

export const createTokenId = async (metadata: any): Promise<string> => {
  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.create-token-id  { 'uri: "${metadata}", 'precision: 0, 'policies: [] } (read-keyset 'creation_guard))`,
    )
    .addData('creation_guard', {
      pred: 'keys-all',
      keys: [guardPublicKey],
    })
    .setNetworkId(getNetworkId())
    .setMeta({
      chainId: getChainId(),
    })
    .createTransaction();

  console.log(222, transaction);

  const response = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return parseResponse<string>(response, 'createTokenId');
};

export const createToken = async (metadata: any) => {
  const tokenId = await createTokenId(metadata);

  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.create-token (read-string 'token-id) 0 (read-string 'uri) [marmalade-v2.non-fungible-policy-v1] (read-keyset 'creation_guard))`,
    )
    .addData('token-id', tokenId)
    .addData('uri', metadata)
    .addData('creation_guard', {
      pred: 'keys-all',
      keys: [guardPublicKey],
    })

    .setNetworkId(getNetworkId())
    .setMeta({
      chainId: getChainId(),
    })
    .addSigner(guardPublicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('marmalade-v2.ledger.CREATE-TOKEN', tokenId, {
        pred: 'keys-all',
        keys: [guardPublicKey],
      }),
    ])
    .createTransaction();

  const signed = await signWithChainweaver(transaction);
  console.log(signed);
};
