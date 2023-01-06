import { pubsub } from '../../utils/pubsub';

import { getBlocks } from './lastBlock/BlocksService';
import { mockBlocks } from './lastBlock/mocks/blocks.mock';

const blocksProvider: ReturnType<typeof getBlocks> = getBlocks(
  pubsub,
  // mockBlocks as any,
);

blocksProvider.start();
