import { Block } from '@prisma/client';
import { createPubSub, PubSub } from 'graphql-yoga';

interface IPubSub extends Record<string, [unknown]> {
  NEW_BLOCKS: [NEW_BLOCKS: Block[]];
}

export const pubsub: PubSub<IPubSub> = createPubSub<IPubSub>();
