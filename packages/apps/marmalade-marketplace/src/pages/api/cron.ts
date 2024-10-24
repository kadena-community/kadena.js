import {
  BlocksFromHeightQuery,
  TransactionResult,
} from '@/graphql/generated/graphql';
import {
  getBlocksFromHeight,
  getLastBlockHeight,
} from '@/graphql/queries/client';
import { Sale } from '@/hooks/getSales';
import { env } from '@/utils/env';
import { database } from '@/utils/firebase';
import { BuiltInPredicate, ChainId } from '@kadena/client';
import {
  escrowAccount,
  getAuctionDetails,
  getBid,
  getQuoteInfo,
} from '@kadena/client-utils/marmalade';
import {
  DocumentSnapshot,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';

import type { NextApiRequest, NextApiResponse } from 'next';

interface ResponseData {
  message: string;
}

interface Settings {
  isProcessing: boolean;
  latestProcessedBlockNumber: number;
}

interface Event {
  event: string;
  chainId: ChainId;
  block: number;
  occurredAt: number;
  parameters: any[];
  requestKey: string;
}

interface Bid {
  bidId: string;
  tokenId: string;
  chainId: ChainId;
  block: number;
  bid: number;
  bidder: {
    account: string;
    guard: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
  requestKey: string;
}

export interface QuoteInfo {
  'sale-price': number;
  'sale-type': string;
  'token-id': string;
}

const isChainEnabled: Record<string, boolean> = env.CHAIN_IDS.reduce(
  (acc, chainId) => ({ ...acc, [chainId]: true }),
  {},
);
const isEventEnabled: Record<string, boolean> = env.EVENTS.reduce(
  (acc, event) => ({ ...acc, [event]: true }),
  {},
);

const getAllEventsFromBlock = async (blockNumber: number) => {
  const events: Event[] = [];

  let response: BlocksFromHeightQuery['blocksFromHeight'] | null = null;
  let shouldFetchMore = false;

  do {
    response = await getBlocksFromHeight(
      blockNumber,
      response?.pageInfo?.endCursor,
    );

    shouldFetchMore = !!response?.pageInfo.hasNextPage;

    if (!response?.edges || response.edges.length === 0) {
      break;
    }

    for (const block of response.edges) {
      if (block?.node.height !== blockNumber) {
        shouldFetchMore = false;
        break;
      }

      if (
        !block?.node ||
        !isChainEnabled[block.node.chainId]
        // || block.node.transactions.edges.length === 0
      ) {
        continue;
      }

      for (const tx of block.node.transactions.edges) {
        const txResult = tx.node.result as TransactionResult;

        for (const event of txResult.events.edges) {
          if (!event || !isEventEnabled[event.node.qualifiedName]) continue;

          const data = {
            event: event.node.qualifiedName,
            block: blockNumber,
            chainId: String(block.node.chainId) as ChainId,
            requestKey: event.node.requestKey,
            occurredAt: new Date(block.node.creationTime).getTime(),
            parameters: event.node.parameters
              ? JSON.parse(event.node.parameters)
              : [],
          };

          events.push(data);
        }
      }
    }
  } while (shouldFetchMore);

  return events;
};

async function parseEvents(
  events: Event[],
): Promise<{ sales: Sale[]; bids: Bid[] }> {
  const saleRecords: Record<string, Sale> = {};
  const bidRecords: Record<string, Bid> = {};

  for (const event of events) {
    if (event.event === 'marmalade-v2.policy-manager.QUOTE') {
      const [saleId, tokenId, data] = event.parameters;

      saleRecords[saleId] = {
        ...saleRecords[saleId],
        requestKeys: {
          ...(saleRecords[saleId]?.requestKeys || {}),
          QUOTE: event.requestKey,
        },
        chainId: event.chainId,
        block: event.block,
        saleId,
        tokenId,
        seller: data['seller-fungible-account'],
        saleType: data['sale-type'],
        startPrice: data['sale-price'],
      };
      continue;
    }

    if (event.event === 'marmalade-v2.ledger.SALE') {
      const [tokenId, sellerAccount, amount, timeout, saleId] =
        event.parameters;

      let quoteInfo = {};

      try {
        const data = (await getQuoteInfo({
          saleId: saleId as string,
          chainId: event.chainId,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST,
        })) as QuoteInfo;

        quoteInfo = {
          startPrice: data['sale-price'],
          saleType: data['sale-type'],
        };
      } catch (error) {
        // sale does not have quote
        console.log('error', error);
      }

      saleRecords[saleId] = {
        ...saleRecords[saleId],
        requestKeys: {
          ...(saleRecords[saleId]?.requestKeys || {}),
          SALE: event.requestKey,
        },
        seller: {
          ...(saleRecords[saleId]?.seller || {}),
          account: sellerAccount,
        },
        chainId: event.chainId,
        block: event.block,
        status: 'CREATED',
        saleId,
        tokenId,
        amount,
        timeoutAt: Number(timeout.int) * 1000,
        endsAt: Number(timeout.int) * 1000,
        ...quoteInfo,
      };
      continue;
    }

    if (event.event === 'marmalade-v2.ledger.WITHDRAW') {
      const [tokenId, sellerAccount, amount, timeout, saleId] =
        event.parameters;

      saleRecords[saleId] = {
        ...saleRecords[saleId],
        requestKeys: {
          ...(saleRecords[saleId]?.requestKeys || {}),
          WITHDRAW: event.requestKey,
        },
        seller: {
          ...(saleRecords[saleId]?.seller || {}),
          account: sellerAccount,
        },
        chainId: event.chainId,
        block: event.block,
        status: 'WITHDRAWN',
        tokenId,
        saleId,
        amount,
        timeoutAt: Number(timeout.int) * 1000,
      };
      continue;
    }

    if (event.event === 'marmalade-v2.ledger.BUY') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [tokenId, seller, buyer, amount, saleId] = event.parameters;

      saleRecords[saleId] = {
        ...saleRecords[saleId],
        requestKeys: {
          ...(saleRecords[saleId]?.requestKeys || {}),
          BUY: event.requestKey,
        },
        chainId: event.chainId,
        block: event.block,
        status: 'SOLD',
        saleId,
        tokenId,
        buyer: { account: buyer },
      };
      continue;
    }

    if (
      event.event === 'marmalade-sale.dutch-auction.AUCTION_CREATED' ||
      event.event === 'marmalade-sale.dutch-auction.MANAGE_AUCTION'
    ) {
      const [saleId, tokenId] = event.parameters;

      const data = await getAuctionDetails({
        auctionConfig: {
          dutch: true,
        },
        saleId: saleId as string,
        chainId: event.chainId,
        networkId: env.NETWORKID,
        host: env.CHAINWEB_API_HOST,
      });

      saleRecords[saleId] = {
        ...saleRecords[saleId],
        requestKeys: {
          ...(saleRecords[saleId]?.requestKeys || {}),
          AUCTION_CREATED: event.requestKey,
        },
        chainId: event.chainId,
        block: event.block,
        saleId,
        tokenId,
        saleType: 'marmalade-sale.dutch-auction',
        startsAt: Number(data['start-date'].int) * 1000,
        endsAt: Number(data['end-date'].int) * 1000,
        startPrice: data['start-price'],
        reservePrice: data['reserve-price'],
        sellPrice: data['sell-price'],
        priceInterval: data['price-interval-seconds'],
      };
      continue;
    }

    if (event.event === 'marmalade-sale.dutch-auction.PRICE_ACCEPTED') {
      const [saleId, tokenId] = event.parameters;

      const auctionDetails = await getAuctionDetails({
        auctionConfig: {
          dutch: true,
        },
        saleId: saleId as string,
        chainId: event.chainId,
        networkId: env.NETWORKID,
        host: env.CHAINWEB_API_HOST,
      });

      saleRecords[saleId] = {
        ...saleRecords[saleId],
        requestKeys: {
          ...(saleRecords[saleId]?.requestKeys || {}),
          PRICE_ACCEPTED: event.requestKey,
        },
        chainId: event.chainId,
        block: event.block,
        buyer: {
          account: auctionDetails.buyer,
          guard: auctionDetails['buyer-guard'],
        },
        sellPrice: auctionDetails['sell-price'],
        saleId,
        tokenId,
      };
      continue;
    }

    if (
      event.event === 'marmalade-sale.conventional-auction.AUCTION_CREATED' ||
      event.event === 'marmalade-sale.conventional-auction.MANAGE_AUCTION'
    ) {
      const [saleId, tokenId] = event.parameters;

      const [data, escrow] = await Promise.all([
        getAuctionDetails({
          auctionConfig: {
            conventional: true,
          },
          saleId: saleId as string,
          chainId: event.chainId,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST,
        }),
        escrowAccount({
          saleId: saleId as string,
          chainId: event.chainId,
          networkId: env.NETWORKID,
          host: env.CHAINWEB_API_HOST,
        }),
      ]);

      saleRecords[saleId] = {
        ...saleRecords[saleId],
        requestKeys: {
          ...(saleRecords[saleId]?.requestKeys || {}),
          AUCTION_CREATED: event.requestKey,
        },
        chainId: event.chainId,
        block: event.block,
        saleId,
        tokenId,
        saleType: 'marmalade-sale.conventional-auction',
        startsAt: Number(data['start-date'].int) * 1000,
        endsAt: Number(data['end-date'].int) * 1000,
        reservePrice: data['reserve-price'],
        highestBid: data['highest-bid'],
        highestBidId: data['highest-bid-id'],
      };

      if (event.event === 'marmalade-sale.conventional-auction.AUCTION_CREATED')
        saleRecords[saleId].escrow = escrow;

      continue;
    }

    if (event.event === 'marmalade-sale.conventional-auction.BID_PLACED') {
      const [bidId, saleId] = event.parameters;

      const bidDetails = await getBid({
        bidId: bidId as string,
        chainId: event.chainId,
        networkId: env.NETWORKID,
        host: env.CHAINWEB_API_HOST,
      });

      const quoteInfo = (await getQuoteInfo({
        saleId: saleId as string,
        chainId: event.chainId,
        networkId: env.NETWORKID,
        host: env.CHAINWEB_API_HOST,
      })) as QuoteInfo;

      bidRecords[bidId] = {
        ...bidRecords[bidId],
        chainId: event.chainId,
        block: event.block,
        bidId,
        tokenId: quoteInfo['token-id'],
        bid: bidDetails.bid,
        bidder: {
          account: bidDetails.bidder,
          guard: bidDetails['bidder-guard'],
        },
        requestKey: event.requestKey,
      };
      continue;
    }
  }

  return Promise.resolve({
    sales: Object.values(saleRecords),
    bids: Object.values(bidRecords),
  });
}

async function saveSettings(settings: Partial<Settings>): Promise<void> {
  const settingsRef = doc(database, 'settings', 'default');
  const docSnap = await getDoc(settingsRef);
  if (docSnap.exists()) {
    await updateDoc(settingsRef, settings);
  } else {
    await setDoc(settingsRef, settings);
  }
}

async function getSettings(): Promise<Settings> {
  const settingsRef = doc(database, 'settings', 'default');
  const settingsSnap: DocumentSnapshot = await getDoc(settingsRef);

  if (settingsSnap.exists()) {
    return settingsSnap.data() as Settings;
  } else {
    return { isProcessing: false, latestProcessedBlockNumber: env.START_BLOCK };
  }
}

async function storeSalesInFirebase(sales: Sale[]) {
  const batch = writeBatch(database);

  for (const sale of sales) {
    const saleRef = doc(collection(database, 'sales'), sale.saleId);
    batch.set(saleRef, sale, { merge: true });
  }
  await batch.commit();
}

async function storeBidsInFirebase(bids: Bid[]) {
  const batch = writeBatch(database);

  for (const bid of bids) {
    const bidRef = doc(collection(database, 'bids'), bid.bidId);
    batch.set(bidRef, bid, { merge: true });
  }
  await batch.commit();
}

const sync = async (fromBlock: number, toBlock: number) => {
  await saveSettings({ isProcessing: true });

  try {
    for (let i = fromBlock; i <= toBlock; i++) {
      // Fetching too many blocks
      const events = await getAllEventsFromBlock(i);

      // not enough time to process these steps after
      const { sales, bids } = await parseEvents(events);

      if (sales.length > 0) {
        await storeSalesInFirebase(sales);
      }

      if (bids.length > 0) {
        await storeBidsInFirebase(bids);
      }

      await saveSettings({ latestProcessedBlockNumber: i });
    }
  } catch (error) {
    await saveSettings({ isProcessing: false });
    throw error;
  } finally {
    await saveSettings({ isProcessing: false });
  }

  await saveSettings({ isProcessing: false });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { isProcessing, latestProcessedBlockNumber } = await getSettings();
  if (isProcessing) {
    res.status(425).json({ message: 'SYNCING' });
    return;
  }

  try {
    const latestBlockNumber = await getLastBlockHeight();

    if (!latestBlockNumber) {
      res.status(500).json({ message: 'Error fetching latest block number' });
      return;
    }

    console.log(latestProcessedBlockNumber, latestBlockNumber);

    if (latestProcessedBlockNumber >= latestBlockNumber) {
      res.status(200).json({ message: 'IN SYNC' });
      return;
    }

    const blocksToProcess = Math.min(
      1000,
      latestBlockNumber - latestProcessedBlockNumber,
    );
    await sync(
      latestProcessedBlockNumber + 1,
      latestProcessedBlockNumber + blocksToProcess + 1,
    );

    res.status(200).write('OK');
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error?.message ?? 'Error' });
    return;
  }
}
