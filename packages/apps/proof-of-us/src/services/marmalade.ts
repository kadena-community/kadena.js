import { env } from '@/utils/env';
import type {
  ChainId,
  ICommandResult,
  IPollRequestPromise,
} from '@kadena/client';
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
  'WEBAUTHN-a5010203262001215820c80da60bf93eb53694ce43d39b8fe25ca3a7dc054507ec88a14966117f66a543225820ee351bf3b5a9e0efe9cbd3bc6708ccbe9bdd3205d4969820646f7d0e8d4951d4';

export const pollStatus = async (
  requestKeys: string[] | string,
): Promise<IPollRequestPromise<ICommandResult>> => {
  // You can await this promise, but you can also await the result of each individual request
  if (!Array.isArray(requestKeys)) {
    return client.pollStatus(
      {
        requestKey: requestKeys,
        networkId: env.NETWORKID,
        chainId: env.CHAINID as ChainId,
      },
      {
        onPoll: (requestKey) => {
          console.log('polling status of', requestKey);
        },
      },
    );
  }

  const transactionDescriptors = requestKeys.map((req) => ({
    requestKey: req,
    networkId: env.NETWORKID,
    chainId: env.CHAINID as ChainId,
  }));

  return client.pollStatus(transactionDescriptors, {
    onPoll: (requestKey) => {
      console.log('polling status of', requestKey);
    },
  });
};

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
    .addSigner(
      {
        pubKey: guardPublicKey,
        // @ts-expect-error WebAuthn is not yet added to the @kadena/client types
        scheme: 'WebAuthn',
      },
      (withCap) => [
        withCap('coin.GAS'),
        withCap('marmalade-v2.ledger.CREATE-TOKEN', tokenId, {
          pred: 'keys-all',
          keys: [guardPublicKey],
        }),
      ],
    )
    .createTransaction();

  console.log({ transaction });
  const signed = await signWithChainweaver(transaction);
  console.log(signed);

  const pollResult = await pollStatus(transaction.hash);

  console.log({ pollResult });
};
