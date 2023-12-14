/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  IUnsignedCommand,
  Pact,
  createClient,
  isSignedTransaction,
  signWithChainweaver,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { config } from 'dotenv';
import { join } from 'path';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config({ path: join(__dirname, '../.env.local') });

const namespace = 'n_b34269eda3858bda9aa4a5949896e30a86c6737e';

// Public keys. Both must have KDA for gas fees on chain 1.
// creatorPublicKey = the account registered in the imr-admins keyset
const creatorPublicKey = process.env.DEV_CREATE_AUCTION_ADMIN_KEY!;
// A different keyset that is used for token guards
const guardPublicKey = process.env.DEV_CREATE_AUCTION_NFT_KEY!;

if (!creatorPublicKey)
  throw Error('Missing admin public key. Add it to .env.local');
if (!guardPublicKey)
  throw Error('Missing NFT public key. Add it to .env.local');

const client = createClient();
type AuctionType = 'dutch' | 'conventional';
type Auction = {
  type: AuctionType;
  'token-id': string;
  'sale-id': string;
  'highest-bid-id': string;
  'highest-bid': string;
  'reserve-price': number;
  'start-date': { int: number };
  'end-date': { int: number };
};

function generateUri() {
  const rnd = Math.floor(Math.random() * 1000);
  return `https://immutable-records-git-previewbuild-kadena-js.vercel.app/api/test?number=1&rnd=${rnd}`;
  //return `https://immutable-records-cfsyqmz5e-kadena-js.vercel.app/api/test?number=1&rnd=${rnd}`;
}

async function createTokenId(uri: string) {
  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.create-token-id {'precision: 0, 'policies: [${namespace}.imr-auction-policy marmalade-v2.non-fungible-policy-v1 marmalade-v2.guard-policy-v1], 'uri: (read-string "uri")} (read-keyset 'creation_guard))`,
    )
    .addData('uri', uri)
    .addData('creation_guard', {
      pred: 'keys-all',
      keys: [guardPublicKey],
    })
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
}

async function createToken(tokenId: string, uri: string) {
  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.create-token (read-string 'token-id) 0 (read-string 'uri) [${namespace}.imr-auction-policy marmalade-v2.non-fungible-policy-v1 marmalade-v2.guard-policy-v1] (read-keyset 'creation_guard))`,
    )
    .addData('token-id', tokenId)
    .addData('uri', uri)
    .addData('creation_guard', {
      pred: 'keys-all',
      keys: [guardPublicKey],
    })
    .addData('mint_guard', {
      pred: 'keys-all',
      keys: [guardPublicKey],
    })
    .addData('royalty_spec', {
      fungible: {
        refName: {
          name: 'coin',
          namespace: null,
        },
        refSpec: [{ name: 'fungible-v2', namespace: null }],
      },
      creator: `k:${guardPublicKey}`,
      'creator-guard': {
        pred: 'keys-all',
        keys: [guardPublicKey],
      },
      'royalty-rate': 0.1,
    })
    .addData('artist_royalty_spec', {
      artist:
        'k:db601702162a84e6561d4cd6011c420b63c65214151cf4c40aeaf526abc3a5f9',
      'artist-guard': {
        pred: 'keys-all',
        keys: [
          'db601702162a84e6561d4cd6011c420b63c65214151cf4c40aeaf526abc3a5f9',
        ],
      },
      'royalty-cut': 0.2,
    })
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '1',
      senderAccount: `k:${creatorPublicKey}`,
    })
    .addSigner(guardPublicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('marmalade-v2.ledger.CREATE-TOKEN', tokenId, {
        pred: 'keys-all',
        keys: [guardPublicKey],
      }),
    ])
    .addSigner(creatorPublicKey)
    .createTransaction();

  const signed = await signWithChainweaver(transaction);
  console.log(signed);

  if (!isSignedTransaction(signed)) throw Error('Not a signed transaction');

  const polldata = await client.submit(signed);
  console.log(`CREATE-TOKEN requestKey: ${polldata.requestKey}`);

  console.log('Polling for result...');
  const resolved = await client.pollStatus(polldata);
  const result = resolved[polldata.requestKey];

  if (result.result.status === 'success') {
    return result.result.data;
  }
  throw Error(`Transaction failed: ${JSON.stringify(result)}`);
}

async function mintToken(tokenId: string) {
  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.mint (read-msg 'token-id) (read-string "creator") (read-keyset 'creator-guard) 1.0)`,
    )
    .addData('token-id', tokenId)
    .addData('creator', `k:${guardPublicKey}`)
    .addData('creator-guard', {
      pred: 'keys-all',
      keys: [guardPublicKey],
    })
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '1',
      senderAccount: `k:${guardPublicKey}`,
    })
    .addSigner(creatorPublicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap('marmalade-v2.ledger.MINT', tokenId, `k:${guardPublicKey}`, 1.0),
    ])
    .addSigner(guardPublicKey)
    .createTransaction();

  const signed = await signWithChainweaver(transaction);
  console.log(signed);

  if (!isSignedTransaction(signed)) throw Error('Not a signed transaction');

  const polldata = await client.submit(signed);
  console.log(`MINT-TOKEN requestKey: ${polldata.requestKey}`);

  console.log('Polling for result...');
  const resolved = await client.pollStatus(polldata);
  const result = resolved[polldata.requestKey];

  if (result.result.status === 'success') {
    return result.result.data;
  }
  throw Error(`Transaction failed: ${JSON.stringify(result)}`);
}

async function createSale(tokenId: string) {
  const transaction = Pact.builder
    .execution(
      `(marmalade-v2.ledger.sale (read-msg 'token-id) (read-msg 'creator) 1.0 0)`,
    )
    .addData('token-id', tokenId)
    .addData('creator', `k:${guardPublicKey}`)
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '1',
      senderAccount: `k:${guardPublicKey}`,
    })
    .addSigner(creatorPublicKey, (withCap) => [
      withCap('coin.GAS'),
      withCap(
        'marmalade-v2.ledger.OFFER',
        tokenId,
        `k:${guardPublicKey}`,
        1.0,
        new PactNumber(0).toPactInteger(),
      ),
    ])
    .addSigner(guardPublicKey)
    .createTransaction();

  const signed = await signWithChainweaver(transaction);
  console.log(signed);

  if (!isSignedTransaction(signed)) throw Error('Not a signed transaction');

  const polldata = await client.submit(signed);
  console.log(`SALE requestKey: ${polldata.requestKey}`);

  console.log('Polling for result...');
  const resolved = await client.pollStatus(polldata);
  const result = resolved[polldata.requestKey];

  if (result.result.status === 'success') {
    return result.result.data;
  }
  throw Error(`Transaction failed: ${JSON.stringify(result)}`);
}

async function createAuction(
  tokenId: string,
  saleId: string,
  startTime: Date,
  endTime: Date,
  reservePrice: string,
  type: AuctionType,
) {
  const startTimeInt = Math.floor(startTime.getTime() / 1000);
  const endTimeInt = Math.floor(endTime.getTime() / 1000);
  const transaction = Pact.builder
    .execution(
      `(${namespace}.imr-auction-policy.create-auction (read-string "sale-id") (read-string "token-id") ${startTimeInt} ${endTimeInt} ${reservePrice} "${type}")`,
    )
    .addData('sale-id', saleId)
    .addData('token-id', tokenId)
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '1',
      senderAccount: `k:${guardPublicKey}`,
    })
    .addSigner(guardPublicKey, (withCap) => [withCap('coin.GAS')])
    .addSigner(creatorPublicKey)
    .createTransaction();

  const signed = await signWithChainweaver(transaction);
  console.log(signed);

  if (!isSignedTransaction(signed)) throw Error('Not a signed transaction');

  const polldata = await client.submit(signed);
  console.log(`CREATE-AUCTION requestKey: ${polldata.requestKey}`);

  console.log('Polling for result...');
  const resolved = await client.pollStatus(polldata);
  const result = resolved[polldata.requestKey];

  if (result.result.status === 'success') {
    return result.result.data;
  }
  throw Error(`Transaction failed: ${JSON.stringify(result)}`);
}

// async function retrieveAuction(auctionId: number) {
//   const transaction: IUnsignedCommand = Pact.builder
//     .execution(
//       `(${namespace}.imr-auction-policy.retrieve-auction ${auctionId})`,
//     )
//     // .execution(Pact.modules[contract]["retrieve-auction"](pactInt(auctionId)))
//     .setMeta({ chainId: '1' })
//     .setNetworkId('testnet04')
//     .createTransaction();

//   const response = await client.local(transaction, {
//     preflight: false,
//     signatureVerification: false,
//   });

//   return response.result.status === 'success'
//     ? (response.result.data as Auction)
//     : null;
// }

// async function getLastAuction(startScanId: number) {
//   let lastAuction = null as Auction | null;
//   let lastCheckedAuctionId = startScanId - 1;
//   let lookupLimit = 100;
//   // eslint-disable-next-line no-constant-condition
//   while (true) {
//     // Safety for while loop
//     lookupLimit--;
//     if (lookupLimit <= 0) {
//       throw Error(
//         `Lookup limit reached, update LAST_AUCTION_ID to at least ${lastCheckedAuctionId}`,
//       );
//     }

//     lastCheckedAuctionId++;
//     const auction = await retrieveAuction(lastCheckedAuctionId);
//     if (auction) {
//       lastAuction = auction;
//       console.log(
//         `Auction ${lastCheckedAuctionId} type: ${auction.type.padEnd(
//           12,
//           ' ',
//         )} ends: ${new Date(auction['end-date'].int * 1000).toISOString()}`,
//       );
//     } else {
//       if (!lastAuction)
//         throw Error(`No auctions found, update LAST_AUCTION_ID`);
//       console.log(`Unused auction ID: ${lastCheckedAuctionId}`);
//       return {
//         unusedId: lastCheckedAuctionId,
//         lastAuction: lastAuction,
//       };
//     }
//   }
// }

// function nextAuctionType(type: AuctionType): AuctionType {
//   if (type === 'dutch') {
//     return 'conventional';
//   }
//   if (type === 'conventional') {
//     return 'dutch';
//   }
//   throw Error(`Invalid type given to nextAuctionType`);
// }

// function printTokensJson(auction: Auction, auctionId: number) {
//   console.log(`--- Copy to src/services/marmalade/tokens.ts ---`);

//   const firstAuction = new Date('1992-01-06');
//   const thisAuctionWeek = addDays(firstAuction, auctionId * 7);

//   console.log(
//     `{
//   token: getMockToken("${auctionId}"),
//   auction: {
//     id: ${auctionId},
//     "start-date": { int: ${auction['start-date'].int * 1000} },
//     "end-date": { int: ${auction['end-date'].int * 1000} },
//   },
//   data: {
//     date: new Date("${thisAuctionWeek.toISOString()}"),
//     title: "auction ${auctionId}",
//     description: "NFT Desc",
//     image: "https://arweave.net/GMiEuUAFeXyqtIdWShFb1hM0YCjwBgdlBeO8g90o-3I",
//     artist: "Steven Straatemans",
//     royalty: 10,
//     jsonURL:
//       "https://arweave.net/Op2BUZdRW5FdCL6wYqUISJw_iB4HYaYtWSQSN-mVK0E/NFT-series-1/19920112/metadata-19920112.json ",
//     tokenID: "UNgV2_JMfDFQy98MsvV5bBEwUJ1yorkRu3fwi1Lxcr8",
//   },
// },`,
//   );
//   console.log('---');
// }

// async function run({
//   lastAuctionId,
//   durationHours,
//   reservePrice,
// }: {
//   lastAuctionId: number;
//   durationHours: number;
//   reservePrice: string;
// }) {
//   const { unusedId, lastAuction } = await getLastAuction(lastAuctionId);
//   const auctionType = nextAuctionType(lastAuction.type);
//   console.log(
//     `Creating auction with type: ${auctionType} duration: ${durationHours}h ID: ${unusedId}`,
//   );

//   // Dutch auction minimum 1 hour
//   if (auctionType === 'dutch' && durationHours < 1) {
//     throw Error('Dutch auction must have a duration of at least 1 hour');
//   }

//   const uri = generateUri();
//   const tokenId = await createTokenId(uri);
//   console.log(`TokenId: ${tokenId}`);

//   if (!tokenId) throw Error('No token ID');

//   const created = await createToken(tokenId, uri);
//   console.log(created);

//   const minted = await mintToken(tokenId);
//   console.log(minted);

//   const saleId = await createSale(tokenId);
//   console.log(saleId);

//   const auction = await createAuction(
//     tokenId,
//     String(saleId),
//     addMinutes(new Date(), 5),
//     addMinutes(new Date(), 5 + durationHours * 60),
//     reservePrice,
//     nextAuctionType(lastAuction.type),
//   );

//   console.log(auction);

//   printTokensJson(lastAuction, unusedId);
// }

// // steps
// // 1. get a token-id (local call create-token-id)
// // 2. create a token using token-id (create-token)
// // 3. mint the token
// // 4. create an auction

// run({
//   // lastAuctionId does not need to be updated every run.
//   // Increasing it will prevent scanning the chain for unused auction IDs
//   lastAuctionId: 29,
//   durationHours: 2,
//   reservePrice: '5.0',
// }).catch((e) => {
//   console.log('Fatal error:', e);
// });
