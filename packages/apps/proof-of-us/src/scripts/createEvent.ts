import {
  Pact,
  createClient,
  createSignWithChainweaver,
  isSignedTransaction,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { addHours, addMinutes } from 'date-fns';
import dotenv from 'dotenv';
import { NFTStorage } from 'nft.storage';
import { createImageUrl, createMetaDataUrl } from '../utils/upload';

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

//proof-of-us:4kMC4g88M0GOvtFMwWYkuMB-DUXY3LEuShgoYmf74j4
const namespace = 'n_31cd1d224d06ca2b327f1b03f06763e305099250';
const collectionId = 'collection:K85ZSH3LUXS3SB_Aokhseap0U6AHyNbSJKGfUM4kbik';
const startTime = Math.round(addMinutes(new Date(), 2).getTime() / 1000);
const endTime = Math.round(addHours(new Date(), 200).getTime() / 1000);

const eventName = 'Orko';
const eventType: TokenType = 'attendance';
const imageBase64Str =
  'data:image/png;base64,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';

const kadenaClient = createClient();

const createEventId = async () => {
  const transaction = Pact.builder
    .execution(
      `(${namespace}.proof-of-us.create-event-id "${eventName}" ${startTime} ${endTime}
       
        )`,
    )
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '1',
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
    avatar: {
      backgroundColor: '#941212',
    },
    status: 3,
    signees: [],
    date: startTime * 1000,
  };

  const imageData = await createImageUrl(imageBase64Str);

  if (!imageData) {
    console.log('ERROR!  no imagedata');
    return;
  }

  // @ts-expect-error WebAuthn is not yet added to the @kadena/client types
  const manifest = createManifest(proofOfUs, imageData.url);

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
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '1',
      senderAccount: `k:${senderPubKey}`,
    })
    .addSigner(senderPubKey, (withCap) => [
      withCap(
        `${namespace}.proof-of-us-gas-station.GAS_PAYER`,
        `k:${creatorPublicKey}`,
        new PactNumber(2500).toPactInteger(),
        new PactNumber(1).toPactDecimal(),
      ),
    ])
    .addSigner(creatorPublicKey)

    .createTransaction();

  const signWithChainweaver = createSignWithChainweaver();
  const signedTx = await signWithChainweaver(unsignedTx);

  if (!isSignedTransaction(signedTx)) throw Error('Not a signed transaction');

  const polldata = await kadenaClient.submit(signedTx);
  console.log(`CREATE-TOKEN requestKey: ${polldata.requestKey}`);

  const { result } = await kadenaClient.listen(polldata);

  if (result.status !== 'success') {
    console.log('ERROR');
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
