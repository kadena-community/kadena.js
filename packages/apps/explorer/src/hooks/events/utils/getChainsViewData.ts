import type { EventsQuery } from '../../eventsPerChainQuery';

export interface IEventsQueryView {
  chainId: string;
  data: EventsQuery['events'];
}

/**
 * returns an array of the requested chains, with their data
 */
export const getChainsViewData = (
  chainsData: EventsQuery,
  selectedChains: number[],
) => {
  return Object.entries(chainsData).map(([key, innerData]) => {
    const chain = selectedChains.find((v) => key === `chains${v}`) ?? '0';
    return {
      chainId: `${chain}`,
      data: innerData,
    };
  }) as IEventsQueryView[];
};
