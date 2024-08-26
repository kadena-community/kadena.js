import { EventsQuery } from '@/__generated__/sdk';
import { getChainsViewData } from '../getChainsViewData';

describe('getChainsViewData', () => {
  it('should return an array with chains 1,2,3', () => {
    const data = {
      chains1: {
        name: 'He-man',
      },
      chains2: {
        name: 'Skeletor',
      },
      chains3: {
        name: 'Cringer',
      },
      chains99: {
        name: 'Orko',
      },
    } as unknown as EventsQuery;
    const selectedChains = [1, 2, 3];
    const result = getChainsViewData(data, selectedChains);
    expect(result).toEqual([
      {
        chainId: '1',
        data: {
          name: 'He-man',
        },
      },
      {
        chainId: '2',
        data: {
          name: 'Skeletor',
        },
      },
      {
        chainId: '3',
        data: {
          name: 'Cringer',
        },
      },
      {
        chainId: '0',
        data: {
          name: 'Orko',
        },
      },
    ]);
  });
});
