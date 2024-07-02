import {
  useCompletedBlockHeightsQuery,
  useLastBlockHeightQuery,
  useNewBlocksSubscription,
} from '@/__generated__/sdk';
import { useQueryContext } from '@/context/query-context';
import { newBlocks } from '@/graphql/subscriptions/newBlocks.graph';
import type { IBlockData, IChainBlock } from '@/services/block';
import { addBlockData } from '@/services/block';
import { Stack } from '@kadena/kode-ui';
import React, { useEffect, useState } from 'react';
import BlockTableHeader from './block-header/block-header';
import BlockRow from './block-row/block-row';

export const startColumns = [
  { title: 'Chain', subtitle: 'Number' },
  { title: 'Chain', subtitle: 'Difficulty' },
];

const endColumn = { title: 'Block', subtitle: 'Activity' };

const getmaxBlockTxCount = (blockData: IChainBlock): number => {
  const txCounts = Math.max(
    ...Object.entries(blockData)
      .map(([, chain]) => {
        return Object.entries(chain).map(([, block]) => {
          return (block as IBlockData).txCount;
        });
      })
      .flat(),
  );

  return txCounts;
};

const BlockTable: React.FC = () => {
  const { data: newBlocksData } = useNewBlocksSubscription();
  const { data: lastBlockHeight } = useLastBlockHeightQuery();
  const { data: oldBlocksData } = useCompletedBlockHeightsQuery({
    variables: {
      // Change this if the table needs to show more than 80 blocks at once (on startup)
      first: 80,
      // We don't want only completed heights
      completedHeights: false,
      heightCount: 4,
    },
  });

  const [blockData, setBlockData] = useState<IChainBlock>({});
  const [maxBlockTxCount, setmaxBlockTxCount] = useState(0);
  const [blockHeights, updateBlockHeights] = useState<number[]>([1, 2, 3, 4]);

  useEffect(() => {
    if (lastBlockHeight?.lastBlockHeight) {
      const newBlockHeights = Array.from(
        { length: 4 },
        (_, i) => lastBlockHeight.lastBlockHeight - i,
      ).reverse();

      updateBlockHeights(newBlockHeights);
    }
  }, [lastBlockHeight]);

  useEffect(() => {
    if (oldBlocksData) {
      const updatedBlockData = addBlockData(blockData, oldBlocksData);
      setBlockData(updatedBlockData);
    }
  }, [oldBlocksData]);

  useEffect(() => {
    if (newBlocksData) {
      const updatedBlockData = addBlockData(blockData, newBlocksData);
      setBlockData(updatedBlockData);
      setmaxBlockTxCount(getmaxBlockTxCount(updatedBlockData));
      if (!newBlocksData.newBlocks) return;

      const newMaxHeight = Math.max(
        ...newBlocksData.newBlocks.map((block) => block.height),
      );

      if (newMaxHeight > blockHeights[3]) {
        const newBlockHeights = Array.from(
          { length: 4 },
          (_, i) => newMaxHeight - i,
        ).reverse();

        updateBlockHeights(newBlockHeights);
      }
    }
  }, [newBlocksData]);

  const { setQueries } = useQueryContext();
  useEffect(() => {
    setQueries([
      {
        query: newBlocks,
      },
    ]);
  }, []);

  return (
    <>
      <Stack
        display="flex"
        flexDirection={'column'}
        gap={'sm'}
        paddingInline={{ xs: 'xs', md: 'lg' }}
        width="100%"
      >
        <BlockTableHeader
          startColumns={startColumns}
          heightColumns={blockHeights}
          endColumn={endColumn}
        />
        {Object.keys(blockData).map((chainId) => (
          <BlockRow
            key={chainId}
            blockRowData={blockData[Number(chainId)]}
            heights={blockHeights}
            chainId={Number(chainId)}
            maxBlockTxCount={maxBlockTxCount}
          />
        ))}
      </Stack>
    </>
  );
};

export default BlockTable;
