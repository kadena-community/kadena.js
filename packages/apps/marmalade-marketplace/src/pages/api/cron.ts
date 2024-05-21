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
import { KeysetGuard } from '@kadena/client-utils/lib/esm/marmalade/config';
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

type ResponseData = {
  message: string;
};

type Settings = {
  isProcessing: boolean;
  latestProcessedBlockNumber: number;
};

type Event = {
  event: string;
  chainId: number;
  block: number;
  occurredAt: number;
  parameters: any[];
  requestKey: string;
};

type Bid = {
  bidId: string;
  tokenId: string;
  chainId: number;
  block: number;
  bid: number;
  bidder: {
    account: string;
    guard: KeysetGuard;
  };
  requestKey: string;
};

const isChainEnabled: Record<string, boolean> = env.CHAIN_IDS.reduce(
  (acc, chainId) => ({ ...acc, [chainId]: true }),
  {},
);
const isEventEnabled: Record<string, boolean> = env.EVENTS.reduce(
  (acc, event) => ({ ...acc, [event]: true }),
  {},
);

const getAllEventsFromBlock = async (blockNumber: number) => {
  console.log('Getting all events from block', blockNumber);
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
        !isChainEnabled[block.node.chainId] ||
        block.node.transactions.edges.length === 0
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
            chainId: block.node.chainId,
            requestKey: event.node.requestKey,
            occurredAt: new Date(block.node.creationTime).getTime(),
            parameters: event.node.parameters
              ? JSON.parse(event.node.parameters)
              : [],
          };
          console.log(data);

          events.push(data);
        }
      }
    }
  } while (shouldFetchMore);

  return events;
};

function parseEvents(events: Event[]): {
  sales: Sale[];
  bids: Bid[];
} {
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

    if (event.event === 'marmalade-sale.dutch-auction.AUCTION_CREATED') {
      const [saleId, tokenId] = event.parameters;

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
      };
      continue;
    }

    if (event.event === 'marmalade-sale.dutch-auction.PRICE_ACCEPTED') {
      const [saleId, buyer, buyerGuard, price, tokenId] = event.parameters;

      saleRecords[saleId] = {
        ...saleRecords[saleId],
        requestKeys: {
          ...(saleRecords[saleId]?.requestKeys || {}),
          PRICE_ACCEPTED: event.requestKey,
        },
        chainId: event.chainId,
        block: event.block,
        buyer: {
          account: buyer,
          guard: buyerGuard,
        },
        price,
        saleId,
        tokenId,
      };
      continue;
    }

    if (event.event === 'marmalade-sale.conventional-auction.AUCTION_CREATED') {
      const [saleId, tokenId, escrow] = event.parameters;

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
        escrow,
        saleType: 'marmalade-sale.conventional-auction',
      };
      continue;
    }

    if (event.event === 'marmalade-sale.conventional-auction.BID_PLACED') {
      const [bidId, bidder, bidderGuard, bid, tokenId] = event.parameters;

      bidRecords[bidId] = {
        ...bidRecords[bidId],
        chainId: event.chainId,
        block: event.block,
        bidId,
        tokenId,
        bid,
        bidder: {
          account: bidder,
          guard: bidderGuard,
        },
        requestKey: event.requestKey,
      };
      continue;
    }
  }

  return {
    sales: Object.values(saleRecords),
    bids: Object.values(bidRecords),
  };
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

async function storeEventsInFirebase(events: Event[]) {
  const batch = writeBatch(database);

  for (const event of events) {
    const eventRef = doc(collection(database, 'events'));
    batch.set(eventRef, event);
  }
  await batch.commit();
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
      const events = await getAllEventsFromBlock(i);

      await storeEventsInFirebase(events);

      const { sales, bids } = parseEvents(events);

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
  }

  await saveSettings({ isProcessing: false });
};

const getEndBlock = (startBlock: number, latestBlock: number) => {
  const maxBlockDiff = 100;

  if (latestBlock - startBlock > maxBlockDiff) {
    if (startBlock + maxBlockDiff < latestBlock)
      return startBlock + maxBlockDiff;
  }

  return latestBlock;
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

    if (latestProcessedBlockNumber >= latestBlockNumber) {
      console.log('IN SYNC');
      res.status(200).json({ message: 'IN SYNC' });
      return;
    }

    console.log('blockDiff:', latestBlockNumber - latestProcessedBlockNumber);

    const endBlock = getEndBlock(latestProcessedBlockNumber, latestBlockNumber);

    await sync(latestProcessedBlockNumber + 1, endBlock);

    res.status(200).write('OK');
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error?.['message'] ?? 'Error' });
    return;
  }
}
