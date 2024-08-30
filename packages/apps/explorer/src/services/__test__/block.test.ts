import { blockDataLoading } from '@/components/BlockTable/loadingData';
import { addBlockData } from '../block';

describe('block service', () => {
  describe('addBlockData', () => {
    it('should return the existing data when there are no new blocks', () => {
      const existingData = blockDataLoading;
      const result = addBlockData(
        JSON.parse(JSON.stringify(existingData)),
        undefined,
      );

      expect(result).toEqual({ ...existingData });
    });

    it('should return combined data when there is "newBlocks" data', () => {
      const existingData = blockDataLoading;
      const newData: any = {
        newBlocks: [
          {
            __typename: 'Block',
            id: 'QmxvY2s6ZnlXYVJqdjZGd3Jtdnd6bldTUmlPTlNPUVlBZWNzdXdxanpaajNjZDJxTQ==',
            hash: 'fyWaRjv6FwrmvwznWSRiONSOQYAecsuwqjzZj3cd2qM',
            chainId: 2,
            creationTime: '2024-07-26T07:48:36.948Z',
            difficulty: 1127434055992219900,
            height: 4,
            txCount: 0,
            transactions: {
              edges: [],
              __typename: 'BlockTransactionsConnection',
              totalCount: 0,
            },
          },
        ],
      };

      const expectedResult = existingData;
      expectedResult['2']['4'] = newData.newBlocks![0];

      const result = addBlockData(
        JSON.parse(JSON.stringify(existingData)),
        newData,
      );

      expect(result).toEqual(expectedResult);
    });

    it('should return combined data when there is "blocksFromHeight" data', () => {
      const existingData = blockDataLoading;
      const newData: any = {
        blocksFromHeight: {
          edges: [
            {
              __typename: 'QueryBlocksFromHeightConnectionEdge',
              node: {
                __typename: 'Block',
                height: 4,
                hash: '2KicJAA2UTj9UzuxPcBfcDNOh13IEkbTuODqxRgQ724',
                chainId: 0,
                transactions: {
                  totalCount: 0,
                },
                txCount: 0,
              },
            },
          ],
        },
      };

      const expectedResult = existingData;
      expectedResult['0']['4'] = newData.blocksFromHeight.edges[0].node;

      const result = addBlockData(
        JSON.parse(JSON.stringify(existingData)),
        newData,
      );

      expect(result).toEqual(expectedResult);
    });

    it('should return combined data when there is "completedBlockHeights" data', () => {
      const existingData = blockDataLoading;
      const newData: any = {
        completedBlockHeights: {
          edges: [
            {
              __typename: 'QueryBlocksFromHeightConnectionEdge',
              node: {
                __typename: 'Block',
                height: 4,
                hash: '2KicJAA2UTj9UzuxPcBfcDNOh13IEkbTuODqxRgQ724',
                chainId: 0,
                transactions: {
                  totalCount: 0,
                },
                txCount: 0,
              },
            },
          ],
        },
      };

      const expectedResult = existingData;
      expectedResult['0']['4'] = newData.completedBlockHeights.edges[0].node;

      const result = addBlockData(
        JSON.parse(JSON.stringify(existingData)),
        newData,
      );

      expect(result).toEqual(expectedResult);
    });
  });
});
