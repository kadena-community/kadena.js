import {
  Pact,
  createClient,
  isSignedTransaction,
  signWithChainweaver,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

//proof-of-us:4kMC4g88M0GOvtFMwWYkuMB-DUXY3LEuShgoYmf74j4
const namespace = 'n_31cd1d224d06ca2b327f1b03f06763e305099250';
const collectionId = 'collection:K85ZSH3LUXS3SB_Aokhseap0U6AHyNbSJKGfUM4kbik';
const creatorPublicKey =
  '1c835d4e67917fd25781b11db1c12efbc4296c5c7fe981d35bbcf4a46a53441f';

const startTime = 1707897325;
const endTime = 1707926416;
const eventName = 'Masters of the Universe';

const client = createClient();

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

  const result = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.result.status === 'success'
    ? (result.result.data as string)
    : null;
};

const createEvent = async () => {
  const eventId = await createEventId();

  console.log(eventId);

  const price = new PactNumber(2500);

  const transaction = Pact.builder
    .execution(
      `(${namespace}.proof-of-us.create-event
          "${collectionId}" "${eventName}"
          "https://bafybeic54icumn5ijr4iloi6iyd4xavcrebqgiytr6ztm2bxtmphq6xyfe.ipfs.nftstorage.link/metadata" 
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

  console.log(transaction);

  //   const result = await client.local(transaction, {
  //     preflight: false,
  //     signatureVerification: false,
  //   });

  const signed: any = await signWithChainweaver(transaction);

  console.log(signed);

  if (!isSignedTransaction(signed)) throw Error('Not a signed transaction');

  const polldata = await client.submit(signed);
  console.log(`CREATE-TOKEN requestKey: ${polldata.requestKey}`);
};

createEvent();
