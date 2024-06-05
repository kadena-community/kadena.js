import * as dotenv from 'dotenv';
import { get } from './util/storage.js';

dotenv.config();

export const ALGOLIA_APP_ID =
  process.env.ALGOLIA_APP_ID ?? get('env', 'ALGOLIA_APP_ID');
export const ALGOLIA_API_KEY =
  process.env.ALGOLIA_API_KEY ?? get('env', 'ALGOLIA_API_KEY');
export const ALGOLIA_INDEX_NAME =
  process.env.ALGOLIA_INDEX_NAME ?? get('env', 'ALGOLIA_INDEX_NAME');
