import type { Block } from '@prisma/client';
import type { PubSub } from 'graphql-yoga';
import { createPubSub } from 'graphql-yoga';

interface IPubSub extends Record<string, [unknown]> {
  NEW_BLOCKS: [NEW_BLOCKS: Block[]];
}

export const pubsub: PubSub<IPubSub> = createPubSub<IPubSub>();
