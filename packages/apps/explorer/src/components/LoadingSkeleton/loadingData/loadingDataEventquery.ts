import type { EventsQuery } from '@/__generated__/sdk';

export const loadingEventData: EventsQuery['events'] = {
  __typename: 'QueryEventsConnection',
  edges: Array(20).fill({
    __typename: 'QueryEventsConnectionEdge',
    node: {
      chainId: 1,
      requestKey: '0',
      parameters: '["k:0","k:1",2.0]',
      __typename: 'Event',
      block: {
        height: 1,
        __typename: 'Block',
      },
    },
  }),
};
