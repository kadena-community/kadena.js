import { pubsub } from '@utils/pub-sub';
import { getBlocks } from './last-block/blocks-service';

const blocksProvider: ReturnType<typeof getBlocks> = getBlocks(
  pubsub,
  // mockBlocks as any,
);

blocksProvider.start();
