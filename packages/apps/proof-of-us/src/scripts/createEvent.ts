import { uploadImageString } from '@/pages/api/uploadimage';
import { uploadMeta } from '@/pages/api/uploadmeta';
import type { ChainId } from '@kadena/client';
import {
  Pact,
  createSignWithChainweaver,
  isSignedTransaction,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import dotenv from 'dotenv';
import { getClient } from '../utils/client';
import { createManifest } from '../utils/createManifest';
import { createHashData } from '../utils/upload';

dotenv.config();

console.log(process.env.NEXT_PUBLIC_PINATA_DOMAIN);

// This account will be used to create the event, must be added to the keyset on testnet. Ask Jermaine
/* Often used keys:
Ghislain: dde39b7430db47ea354ec4b895535b58466c4c47ee620e44bce48f7648a4cc59
Steven: 1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f
*/
const creatorPublicKey =
  '1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f';

// This account will be used to send the creation tx, must be different from the creatorPublicKey
/*
Often used keys:
Ghislain: f896955bc5ad89e40512ebe8cb4e61b3bc0c7205daf67c1bd648924c203c61c5
Steven: 805b2e339ca8dedb16c4132f149a0f2e4c0d5527cf9eae10aebc133a0339905f
*/
const senderPubKey =
  'db601702162a84e6561d4cd6011c420b63c65214151cf4c40aeaf526abc3a5f9';
const namespace = 'n_31cd1d224d06ca2b327f1b03f06763e305099250';
const collectionId = process.env.NEXT_PUBLIC_CONNECTION_COLLECTIONID ?? '';

const eventName = 'Welcome Kadenian!';
const startTime = Math.round(new Date(2024, 9, 8, 12, 55).getTime() / 1000);
const endTime = Math.round(new Date(2199, 5, 15, 23, 15).getTime() / 1000);
const bgColor = '#0F1D2D';

console.log({
  startime: new Date(startTime * 1000),
  endtime: new Date(endTime * 1000),
});

const eventType: TokenType = 'attendance';
const imageBase64Str =
  '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';

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

  const imageDataResult = await uploadImageString(imageBase64Str);
  console.log({ imageDataResult });
  const imageData = createHashData(imageDataResult);
  console.log({ imageData });

  if (!imageData) {
    console.log('ERROR!  no imagedata');
    return;
  }

  // @ts-expect-error WebAuthn is not yet added to the @kadena/client types
  const manifest = await createManifest(proofOfUs, [], imageData.url);
  const metadataResult = await uploadMeta(manifest);

  const metadata = createHashData(metadataResult);

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

  console.log({ unsignedTx });

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

  console.log({
    imageCid: imageData.data.cid.toString(),
    imageDataURL: imageData.url,
    metadataCid: metadata.data.cid.toString(),
    metadataURL: metadata.url,
  });
};

createEvent();
