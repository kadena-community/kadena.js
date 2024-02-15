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
const endTime = Math.round(addHours(new Date(), 2).getTime() / 1000);
const eventName = 'Greyskull';
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
    eventType,
    title: eventName,
    mintStatus: 'init',
    status: 3,
    signees: [],
    date: startTime,
  };

  const imageData = await createImageUrl(imageBase64Str);
  console.log(imageData);

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

  console.log({ unsignedTx });

  //   const result = await client.local(transaction, {
  //     preflight: false,
  //     signatureVerification: false,
  //   });

  const signWithChainweaver = createSignWithChainweaver();
  const signedTx = await signWithChainweaver(unsignedTx);

  console.log(signedTx);

  if (!isSignedTransaction(signedTx)) throw Error('Not a signed transaction');

  const polldata = await kadenaClient.submit(signedTx);
  console.log(`CREATE-TOKEN requestKey: ${polldata.requestKey}`);

  const { result } = await kadenaClient.listen(polldata);

  console.log(result);

  if (result.status !== 'success') {
    console.log('ERROR');
    return;
  }

  console.log(`TOKEN CREATED!`);

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
