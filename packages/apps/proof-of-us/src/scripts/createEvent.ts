import {
  Pact,
  createClient,
  isSignedTransaction,
  signWithChainweaver,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { addHours, addMinutes } from 'date-fns';
import dotenv from 'dotenv';
import { NFTStorage } from 'nft.storage';
import { createImageUrl, createMetaDataUrl } from '../utils/upload';

import { createManifest } from '../utils/createManifest';

dotenv.config();

//proof-of-us:4kMC4g88M0GOvtFMwWYkuMB-DUXY3LEuShgoYmf74j4
const namespace = 'n_31cd1d224d06ca2b327f1b03f06763e305099250';
const collectionId = 'collection:K85ZSH3LUXS3SB_Aokhseap0U6AHyNbSJKGfUM4kbik';
const creatorPublicKey =
  '1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f';

const startTime = Math.round(addMinutes(new Date(), 2).getTime() / 1000);
const endTime = Math.round(addHours(new Date(), 2).getTime() / 1000);
const eventName = 'Masters of the Universe';
const eventType: TokenType = 'attendance';
const imageBase64Str =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAADMElEQVR4nOzVwQnAIBQFQYXff81RUkQCOyDj1YOPnbXWPmeTRef+/3O/OyBjzh3CD95BfqICMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMK0CMO0TAAD//2Anhf4QtqobAAAAAElFTkSuQmCC';

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
  console.log(1, process.env.NFTSTORAGE_API_TOKEN);
  const eventId = await createEventId();

  console.log(eventId);

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

  const transaction = Pact.builder
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
      senderAccount:
        'k:805b2e339ca8dedb16c4132f149a0f2e4c0d5527cf9eae10aebc133a0339905f',
    })
    .addSigner(
      '805b2e339ca8dedb16c4132f149a0f2e4c0d5527cf9eae10aebc133a0339905f',
      (withCap) => [
        withCap(
          `${namespace}.proof-of-us-gas-station.GAS_PAYER`,
          'k:1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f',
          new PactNumber(2500).toPactInteger(),
          new PactNumber(1).toPactDecimal(),
        ),
      ],
    )
    .addSigner(creatorPublicKey)

    .createTransaction();

  console.log({ transaction });

  //   const result = await client.local(transaction, {
  //     preflight: false,
  //     signatureVerification: false,
  //   });

  const signed: any = await signWithChainweaver(transaction);

  console.log(signed);

  if (!isSignedTransaction(signed)) throw Error('Not a signed transaction');

  const polldata = await kadenaClient.submit(signed);
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
