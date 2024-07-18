import { config } from 'dotenv';
import fs from 'fs';

config();

if (
  !process.env.NEXT_PUBLIC_CHAIN_IDS ||
  process.env.NEXT_PUBLIC_CHAIN_IDS.length === 0
) {
  throw new Error('NEXT_PUBLIC_CHAIN_IDS env variable is not set');
}

const chainIds = process.env.NEXT_PUBLIC_CHAIN_IDS.split(',');

const indexConfig = {
  indexes: chainIds.map((chainId) => ({
    collectionGroup: `events:${chainId}`,
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'event', order: 'ASCENDING' },
      { fieldPath: 'occurredAt', order: 'DESCENDING' },
    ],
  })),
  fieldOverrides: [],
};

fs.writeFileSync(
  'firestore.indexes.json',
  JSON.stringify(indexConfig, null, 2),
);
