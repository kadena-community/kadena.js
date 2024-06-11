import {
  useLastBlockHeightQuery,
  useNewBlocksSubscription,
} from '@/__generated__/sdk';
import type { IChainBlock } from '@/services/block';
import { addBlockData } from '@/services/block';
import { Stack } from '@kadena/react-ui';
import React, { useEffect, useState } from 'react';
import { Media } from '../layout/media';
import BlockTableHeader from './block-header/block-header';
import BlockRow from './block-row/block-row';

export const startColumns = [
  { title: 'Chain', subtitle: 'Number' },
  { title: 'Chain', subtitle: 'Difficulty' },
];

const endColumn = { title: 'Block', subtitle: 'Activity' };

const BlockTable: React.FC = () => {
  const { data: newBlocksData } = useNewBlocksSubscription();
  const { data: lastBlockHeight } = useLastBlockHeightQuery();

  const [blockData, setBlockData] = useState<IChainBlock>({});
  const [blockHeights, updateBlockHeights] = useState<number[]>([4, 3, 2, 1]);

  useEffect(() => {
    if (lastBlockHeight?.lastBlockHeight) {
      const newBlockHeights = Array.from(
        { length: 4 },
        (_, i) => lastBlockHeight.lastBlockHeight - i,
      );
      updateBlockHeights(newBlockHeights);
    }
  }, [lastBlockHeight]);

  useEffect(() => {
    if (newBlocksData) {
      const updatedBlockData = addBlockData(blockData, newBlocksData);
      setBlockData(updatedBlockData);

      if (!newBlocksData.newBlocks) return;

      const newMaxHeight = Math.max(
        ...newBlocksData.newBlocks.map((block) => block.height),
      );

      if (newMaxHeight > blockHeights[0]) {
        const newBlockHeights = Array.from(
          { length: 4 },
          (_, i) => newMaxHeight - i,
        );

        updateBlockHeights(newBlockHeights);
      }
    }
  }, [newBlocksData]);

  return (
    <>
      <Media greaterThanOrEqual="sm">
        <Stack
          display="flex"
          flexDirection={'column'}
          gap={'md'}
          padding={'sm'}
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
            />
          ))}
        </Stack>
      </Media>
      <Media lessThan="sm">
        <Stack
          display="flex"
          flexDirection={'column'}
          gap={'md'}
          padding={'sm'}
        >
          <BlockTableHeader
            startColumns={startColumns}
            heightColumns={blockHeights}
            endColumn={endColumn}
            isCompact
          />
          {Object.keys(blockData).map((chainId) => (
            <BlockRow
              key={chainId}
              blockRowData={blockData[Number(chainId)]}
              heights={blockHeights}
              chainId={Number(chainId)}
              isCompact
            />
          ))}
        </Stack>
      </Media>
    </>
  );
};

export default BlockTable;
