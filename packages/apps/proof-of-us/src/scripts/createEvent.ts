import type { ChainId } from '@kadena/client';
import {
  Pact,
  createSignWithChainweaver,
  isSignedTransaction,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import dotenv from 'dotenv';
import { NFTStorage } from 'nft.storage';
import { createImageUrl, createMetaDataUrl } from '../utils/upload';

import { getClient } from '../utils/client';
import { createManifest } from '../utils/createManifest';

dotenv.config();

// This account will be used to create the event, must be added to the keyset on testnet. Ask Jermaine
/* Often used keys:
Ghislain: dde39b7430db47ea354ec4b895535b58466c4c47ee620e44bce48f7648a4cc59
Steven: 1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f
*/
const creatorPublicKey =
  'dde39b7430db47ea354ec4b895535b58466c4c47ee620e44bce48f7648a4cc59';

// This account will be used to send the creation tx, must be different from the creatorPublicKey
/*
Often used keys:
Ghislain: f896955bc5ad89e40512ebe8cb4e61b3bc0c7205daf67c1bd648924c203c61c5
Steven: 805b2e339ca8dedb16c4132f149a0f2e4c0d5527cf9eae10aebc133a0339905f
*/
const senderPubKey =
  'f896955bc5ad89e40512ebe8cb4e61b3bc0c7205daf67c1bd648924c203c61c5';
const namespace = 'n_31cd1d224d06ca2b327f1b03f06763e305099250';
const collectionId = process.env.NEXT_PUBLIC_CONNECTION_COLLECTIONID ?? '';

const eventName = 'Voxxed Days';
const startTime = Math.round(new Date(2024, 5, 20, 20, 15).getTime() / 1000);
const endTime = Math.round(new Date(2024, 5, 22, 23, 0).getTime() / 1000);
const bgColor = '#271755';

console.log({
  startime: new Date(startTime * 1000),
  endtime: new Date(endTime * 1000),
});

const eventType: TokenType = 'attendance';
const imageBase64Str =
  'data:image/jpeg;base64,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';

const kadenaClient = getClient(process.env.NEXT_PUBLIC_CHAINWEBAPIURL ?? '');

const createEventId = async () => {
  const transaction = Pact.builder
    .execution(
      `(${namespace}.proof-of-us.create-event-id "${eventName}" ${startTime} ${endTime}
)`,
    )
    .setNetworkId(process.env.NEXT_PUBLIC_NETWORKID ?? '')
    .setMeta({
      chainId: process.env.NEXT_PUBLIC_CHAINID as ChainId,
    })
    .createTransaction();

  const result = await kadenaClient.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.result.status === 'success'
    ? (result.result.data as string)
    : null;
};

const createEvent = async () => {
  const eventId = await createEventId();

  const proofOfUs = {
    eventId,
    type: eventType,
    title: eventName,
    mintStatus: 'init',
    backgroundColor: bgColor,
    status: 3,
    date: startTime * 1000,
  };

  const imageData = await createImageUrl(imageBase64Str);

  if (!imageData) {
    console.log('ERROR!  no imagedata');
    return;
  }

  // @ts-expect-error WebAuthn is not yet added to the @kadena/client types
  const manifest = await createManifest(proofOfUs, [], imageData.url);
  const metadata = await createMetaDataUrl(manifest);

  if (!metadata) {
    console.log('ERROR no metadata');
    return;
  }

  const unsignedTx = Pact.builder
    .execution(
      `(${namespace}.proof-of-us.create-event
            "${collectionId}" "${eventName}"
            "${metadata.url}"
            ${startTime}
            ${endTime}
            )`,
    )
    .addData('collection_id', collectionId)
    .addData('event_id', `${eventId}`)
    .addData('creator-guard', {
      pred: 'keys-any',
      keys: [creatorPublicKey],
    })
    .setNetworkId(process.env.NEXT_PUBLIC_NETWORKID ?? '')
    .setMeta({
      chainId: process.env.NEXT_PUBLIC_CHAINID as ChainId,
      senderAccount: `k:${senderPubKey}`,
    })
    .addSigner(creatorPublicKey, (withCap) => [
      withCap(
        `${namespace}.proof-of-us-gas-station.GAS_PAYER`,
        `k:${creatorPublicKey}`,
        new PactNumber(2500).toPactInteger(),
        new PactNumber(1).toPactDecimal(),
      ),
      withCap(
        `${namespace}.proof-of-us.EVENT`,
        collectionId,
        eventId,
        eventName,
        metadata.url,
      ),
    ])
    .addSigner(senderPubKey)
    .createTransaction();

  const signWithChainweaver = createSignWithChainweaver();
  const signedTx = await signWithChainweaver(unsignedTx);

  console.log(signedTx);

  if (!isSignedTransaction(signedTx)) throw Error('Not a signed transaction');

  const polldata = await kadenaClient.submit(signedTx);
  console.log(`CREATE-TOKEN requestKey: ${polldata.requestKey}`);

  const { result } = (await kadenaClient.pollStatus(polldata))[
    polldata.requestKey
  ];

  if (result.status !== 'success') {
    console.log('ERROR', result);
    return;
  } else {
    console.log(`\n\nTOKEN CREATED!`, result.data);
    console.log(
      'Scan URL:',
      `https://devworld.kadena.io/scan/e/${result.data}`,
    );
    console.log(`\n\n`);
  }

  console.log('start upload');

  if (!process.env.NFTSTORAGE_API_TOKEN) {
    console.log('ERROR: NFTSTORAGE_API_TOKEN NOT DEFINED');
    return;
  }
  const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN });

  const results = await Promise.allSettled([
    client.storeCar(imageData.data.car),
    client.storeCar(metadata.data.car),
  ]);

  const failed = results.filter((result) => result.status === 'rejected');

  if (failed.length) {
    console.log('Error uploading data to IPFS', failed);
  }

  console.log({
    imageCid: imageData.data.cid.toString(),
    imageDataURL: imageData.url,
    metadataCid: metadata.data.cid.toString(),
    metadataURL: metadata.url,
  });
};

createEvent();
