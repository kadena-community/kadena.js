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
  '1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f';

// This account will be used to send the creation tx, must be different from the creatorPublicKey
/*
Often used keys:
Ghislain: f896955bc5ad89e40512ebe8cb4e61b3bc0c7205daf67c1bd648924c203c61c5
Steven: 805b2e339ca8dedb16c4132f149a0f2e4c0d5527cf9eae10aebc133a0339905f
*/
const senderPubKey =
  '805b2e339ca8dedb16c4132f149a0f2e4c0d5527cf9eae10aebc133a0339905f';
const namespace = 'n_31cd1d224d06ca2b327f1b03f06763e305099250';
const collectionId = 'collection:tC8klNIATdbDN2iTwLI89qRoJovqDz2mi5Pbk7igNXk'; 

const eventName = 'Kadena';
const startTime = Math.round(new Date(2024, 3, 15, 10, 0).getTime() / 1000);
const endTime = Math.round(new Date(2025, 3, 20, 13, 0).getTime() / 1000);
const bgColor = '#ff00ff';

console.log({
  startime: new Date(startTime * 1000),
  endtime: new Date(endTime * 1000),
});

const eventType: TokenType = 'attendance';
const imageBase64Str =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQ0IiBoZWlnaHQ9IjIyMyIgdmlld0JveD0iMCAwIDM0NCAyMjMiIGZpbGw9Im5vbmUiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMF9iXzE0OF80NjUpIj4KICAgIDxwYXRoIGQ9Ik0wIDEyQzAgNS4zNzI1OSA1LjM3MjU4IDAgMTIgMEgzMzJDMzM4LjYyNyAwIDM0NCA1LjM3MjU4IDM0NCAxMlYyMTFDMzQ0IDIxNy42MjcgMzM4LjYyNyAyMjMgMzMyIDIyM0gxMkM1LjM3MjU5IDIyMyAwIDIxNy42MjcgMCAyMTFWMTJaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMTQ4XzQ2NSkiLz4KICAgIDxwYXRoIGQ9Ik0wIDEyQzAgNS4zNzI1OSA1LjM3MjU4IDAgMTIgMEgzMzJDMzM4LjYyNyAwIDM0NCA1LjM3MjU4IDM0NCAxMlYyMTFDMzQ0IDIxNy42MjcgMzM4LjYyNyAyMjMgMzMyIDIyM0gxMkM1LjM3MjU5IDIyMyAwIDIxNy42MjcgMCAyMTFWMTJaIiBmaWxsPSJ1cmwoI3BhaW50MV9saW5lYXJfMTQ4XzQ2NSkiLz4KICAgIDxwYXRoIGQ9Ik0wIDEyQzAgNS4zNzI1OSA1LjM3MjU4IDAgMTIgMEgzMzJDMzM4LjYyNyAwIDM0NCA1LjM3MjU4IDM0NCAxMlYyMTFDMzQ0IDIxNy42MjcgMzM4LjYyNyAyMjMgMzMyIDIyM0gxMkM1LjM3MjU5IDIyMyAwIDIxNy42MjcgMCAyMTFWMTJaIiBmaWxsPSJ1cmwoI3BhaW50Ml9saW5lYXJfMTQ4XzQ2NSkiLz4KICAgIDxwYXRoIGQ9Ik0wIDEyQzAgNS4zNzI1OSA1LjM3MjU4IDAgMTIgMEgzMzJDMzM4LjYyNyAwIDM0NCA1LjM3MjU4IDM0NCAxMlYyMTFDMzQ0IDIxNy42MjcgMzM4LjYyNyAyMjMgMzMyIDIyM0gxMkM1LjM3MjU5IDIyMyAwIDIxNy42MjcgMCAyMTFWMTJaIiBmaWxsPSJ1cmwoI3BhaW50M19saW5lYXJfMTQ4XzQ2NSkiLz4KICAgIDxwYXRoIGQ9Ik0wIDEyQzAgNS4zNzI1OSA1LjM3MjU4IDAgMTIgMEgzMzJDMzM4LjYyNyAwIDM0NCA1LjM3MjU4IDM0NCAxMlYyMTFDMzQ0IDIxNy42MjcgMzM4LjYyNyAyMjMgMzMyIDIyM0gxMkM1LjM3MjU5IDIyMyAwIDIxNy42MjcgMCAyMTFWMTJaIiBmaWxsPSJ1cmwoI3BhaW50NF9saW5lYXJfMTQ4XzQ2NSkiIGZpbGwtb3BhY2l0eT0iMC4yIi8+CiAgPC9nPgogIDxnIG9wYWNpdHk9IjAuMiI+CiAgICA8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMTQ4XzQ2NSkiPgogICAgICA8cGF0aCBkPSJNNDE1LjE2NSAyNjQuMTkxSDMzMS44MDRMMzMxLjc1IDI2NC4xNUwzMzEuMDkzIDI2My42NDNMMjI3Ljc4OCAxODMuMDA3TDI3MC4wNyAxNDkuMDk1TDQxNC40NjcgMjYzLjY0M0w0MTUuMTY1IDI2NC4xOTFaIiBmaWxsPSIjRDBEMEQwIi8+CiAgICAgIDxwYXRoIGQ9Ik00MTUuMTY1IDM0SDMzMS44MDRMMzMxLjc1IDM0LjA0MTFMMzMxLjA5MyAzNC41NDgxTDIyNy43ODggMTE1LjE4NEwyNzAuMDcgMTQ5LjA5Nkw0MTQuNDY3IDM0LjU0ODFMNDE1LjE2NSAzNFoiIGZpbGw9InVybCgjcGFpbnQ1X2xpbmVhcl8xNDhfNDY1KSIvPgogICAgICA8cGF0aCBkPSJNMjI3LjgwMyAxNTQuMjA3VjE4Mi45MjZWMTgzLjAyMkwyMjcuODE3IDI2My42NDRWMjY0LjE5MkwyMjcuNzYyIDI2NC4xNTFMMjI3LjExOSAyNjMuNjQ0TDE3Ni44NDggMjIzLjkwOUwxNzYuNzI1IDIyMy44MTNMMTc2IDIyMy4yNTFWNzQuOTQxM0wxNzYuNzI1IDc0LjM3OTZMMTc2Ljg0OCA3NC4yODM3TDIyNy4xMTkgMzQuNTQ4MUwyMjcuNzYyIDM0LjA0MTFMMjI3LjgxNyAzNFYzNC41NDgxTDIyNy44MDMgMTE1LjE3VjExNS4yNjZWMTQ5LjA5NlYxNTQuMjA3WiIgZmlsbD0iI0QwRDBEMCIvPgogICAgPC9nPgogIDwvZz4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9ImZpbHRlcjBfYl8xNDhfNDY1IiB4PSItMjkuOSIgeT0iLTI5LjkiIHdpZHRoPSI0MDMuOCIgaGVpZ2h0PSIyODIuOCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICAgICA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgaW49IkJhY2tncm91bmRJbWFnZUZpeCIgc3RkRGV2aWF0aW9uPSIxNC45NSIvPgogICAgICA8ZmVDb21wb3NpdGUgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9ImluIiByZXN1bHQ9ImVmZmVjdDFfYmFja2dyb3VuZEJsdXJfMTQ4XzQ2NSIvPgogICAgICA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfYmFja2dyb3VuZEJsdXJfMTQ4XzQ2NSIgcmVzdWx0PSJzaGFwZSIvPgogICAgPC9maWx0ZXI+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMTQ4XzQ2NSIgeDE9IjgxIiB5MT0iMjQuNSIgeDI9IjIzMS41IiB5Mj0iMjExLjUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuNjgwNTA4IiBzdG9wLWNvbG9yPSJ3aGl0ZSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuNjgyMzQzIiBzdG9wLWNvbG9yPSIjRjBGMEYwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC44OTQ0MTEiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAuNyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl8xNDhfNDY1IiB4MT0iMS4yNDgxMWUtMDUiIHkxPSI3NCIgeDI9IjE5NC43MyIgeTI9IjMzNC41NTgiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjQiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjUyNSIgc3RvcC1jb2xvcj0iIzc4Nzg3OCIgc3RvcC1vcGFjaXR5PSIwLjEzIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC42NjUiIHN0b3AtY29sb3I9IndoaXRlIiBzdG9wLW9wYWNpdHk9IjAuMjMiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJ3aGl0ZSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl8xNDhfNDY1IiB4MT0iMCIgeTE9IjAiIHgyPSIzNDQiIHkyPSIyMjMiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIwLjU1IiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDNfbGluZWFyXzE0OF80NjUiIHgxPSIxNjIiIHkxPSIxMTgiIHgyPSIzLjUiIHkyPSIxODkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMC41Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQ0X2xpbmVhcl8xNDhfNDY1IiB4MT0iMTQxIiB5MT0iMjU0LjUiIHgyPSIzNDQiIHkyPSItMy4zNDA4NWUtMDUiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjAuNTAwMzY4IiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMC41MDM0MzQiIHN0b3AtY29sb3I9IndoaXRlIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJwYWludDVfbGluZWFyXzE0OF80NjUiIHgxPSIyNTciIHkxPSIxMjguNSIgeDI9IjM0Mi41IiB5Mj0iNTEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0QwRDBEMCIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNEMEQwRDAiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcDBfMTQ4XzQ2NSI+CiAgICAgIDxwYXRoIGQ9Ik0xNzYgMzRIMzQ0VjIxMUMzNDQgMjE3LjYyNyAzMzguNjI3IDIyMyAzMzIgMjIzSDE3NlYzNFoiIGZpbGw9IndoaXRlIi8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KPC9zdmc+';

const kadenaClient = getClient('https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact');

const createEventId = async () => {
  const transaction = Pact.builder
    .execution(
      `(${namespace}.proof-of-us.create-event-id "${eventName}" ${startTime} ${endTime}
)`,
    )
    .setNetworkId('mainnet01')
    .setMeta({
      chainId: '8',
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
    .setNetworkId('mainnet01')
    .setMeta({
      chainId: '8',
      senderAccount: `k:${senderPubKey}`,
    })
    .addSigner(senderPubKey, (withCap) => [
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
    .addSigner(creatorPublicKey)

    .createTransaction();

  console.log({ unsignedTx });
  const signWithChainweaver = createSignWithChainweaver();
  const signedTx = await signWithChainweaver(unsignedTx);

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
