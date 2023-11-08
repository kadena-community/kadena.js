import { pubsub } from '@utils/pubsub';
import { getBlocks } from './lastBlock/BlocksService';

const blocksProvider: ReturnType<typeof getBlocks> = getBlocks(
  pubsub,
  // mockBlocks as any,
);

blocksProvider.start();
