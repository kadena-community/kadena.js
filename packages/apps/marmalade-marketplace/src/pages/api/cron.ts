import {
  BlocksFromHeightQuery,
  TransactionResult,
} from '@/graphql/generated/graphql';
import {
  getBlocksFromHeight,
  getLastBlockHeight,
} from '@/graphql/queries/client';
import { env } from '@/utils/env';
import { database } from '@/utils/firebase';
import {
  DocumentSnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

type EventMap = { [chainId: number]: any[] };

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
  const events: EventMap = {};

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

          if (!events[block.node.chainId]) events[block.node.chainId] = [];

          events[block.node.chainId].push({
            ...event.node,
            occurredAt: new Date(block.node.creationTime).getTime(),
            parameters: event.node.parameters
              ? JSON.parse(event.node.parameters)
              : [],
          });

          console.log({
            ...event.node,
            occurredAt: new Date(block.node.creationTime).getTime(),
            parameters: event.node.parameters
              ? JSON.parse(event.node.parameters)
              : [],
          });
        }
      }
    }
  } while (shouldFetchMore);

  return events;
};

type Settings = {
  isProcessing: boolean;
  latestProcessedBlockNumber: number;
};

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

async function storeEventsInFirebase(allEvents: EventMap, block: number) {
  const chainIds = Object.keys(allEvents).map(Number);

  for (const chainId of chainIds) {
    const events = allEvents[chainId];
    for (const event of events) {
      await addDoc(collection(database, `events:${chainId}`), {
        event: event.qualifiedName,
        block,
        occurredAt: event.occurredAt,
        parameters: event.parameters,
        requestKey: event.requestKey,
      });
    }
  }
}

const sync = async (fromBlock: number, toBlock: number) => {
  await saveSettings({ isProcessing: true });

  try {
    for (let i = fromBlock; i <= toBlock; i++) {
      const events = await getAllEventsFromBlock(i);

      await storeEventsInFirebase(events, i);

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
