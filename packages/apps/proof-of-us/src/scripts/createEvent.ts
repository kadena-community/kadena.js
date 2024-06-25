import { uploadImageString } from '@/pages/api/uploadimage';
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
import { createMetaDataUrl } from '../utils/upload';

dotenv.config();

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

const eventName = 'Test event';
const startTime = Math.round(new Date(2024, 5, 13, 15, 1).getTime() / 1000);
const endTime = Math.round(new Date(2024, 5, 15, 23, 15).getTime() / 1000);
const bgColor = '#271755';

console.log({
  startime: new Date(startTime * 1000),
  endtime: new Date(endTime * 1000),
});

const eventType: TokenType = 'attendance';
const imageBase64Str =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC';

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

  const imageData = await uploadImageString(imageBase64Str);

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

  console.log({
    imageCid: imageData.data.cid.toString(),
    imageDataURL: imageData.url,
    metadataCid: metadata.data.cid.toString(),
    metadataURL: metadata.url,
  });
};

createEvent();
