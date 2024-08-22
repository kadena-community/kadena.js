import {
  useCompletedBlockHeightsQuery,
  useLastBlockHeightQuery,
  useNewBlocksSubscription,
} from '@/__generated__/sdk';
import { useQueryContext } from '@/context/queryContext';
import { completedBlockHeights } from '@/graphql/queries/completed-block-heights.graph';
import { lastBlockHeight } from '@/graphql/queries/last-block-height.graph';
import { newBlocks } from '@/graphql/subscriptions/newBlocks.graph';
import type { IBlockData, IChainBlock } from '@/services/block';
import { addBlockData } from '@/services/block';
import { Stack } from '@kadena/kode-ui';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useToast } from '../Toast/ToastContext/ToastContext';
import { BlockTableHeader } from './BlockHeader/BlockHeader';
import { blockHeaderFixedClass } from './BlockHeader/blockHeader.css';
import { useBlockInfo } from './BlockInfoContext/BlockInfoContext';
import { BlockRow } from './BlockRow/BlockRow';
import { blockDataLoading } from './loadingData';

export const startColumns = [
  { title: 'Chain', subtitle: 'Number' },
  { title: 'Chain', subtitle: 'Difficulty' },
];

const endColumn = { title: 'Chain', subtitle: 'Activity' };

const getMaxBlockTxCount = (blockData: IChainBlock): number => {
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

const blockHeightsLoading = [0, 1, 2, 3];

export const BlockTable: React.FC = () => {
  const { addToast } = useToast();
  const {
    data: newBlocksData,
    loading: newBlocksLoading,
    error: newBlocksError,
  } = useNewBlocksSubscription();
  const {
    data: lastBlockHeightData,
    loading: lastBlockLoading,
    error: lastBlockError,
  } = useLastBlockHeightQuery({
    fetchPolicy: 'no-cache',
  });

  const completedBlockHeightsVariables = {
    // Change this if the table needs to show more than 80 blocks at once (on startup)
    first: 80,
    // We don't want only completed heights
    completedHeights: false,
    heightCount: 4,
  };

  const {
    data: oldBlocksData,
    loading: oldBlocksLoading,
    error: oldBlocksError,
  } = useCompletedBlockHeightsQuery({
    variables: completedBlockHeightsVariables,
    fetchPolicy: 'no-cache',
  });

  const { setQueries } = useQueryContext();
  const { selectedHeight } = useBlockInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [blockData, setBlockData] = useState<IChainBlock>({});
  const [maxBlockTxCount, setmaxBlockTxCount] = useState(0);
  const [blockHeights, updateBlockHeights] = useState<number[]>([1, 2, 3, 4]);
  const [blockHeightsClean, updateBlockHeightsClean] = useState<number[]>([
    1, 2, 3, 4,
  ]);

  const { ref, inView } = useInView({
    rootMargin: '-60px 0px 0px 0px',
    initialInView: true,
  });

  useEffect(() => {
    if (isMounted) return;

    if (newBlocksLoading || lastBlockLoading || oldBlocksLoading) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setIsMounted(true);
      }, 200);
    }
  }, [
    isLoading,
    isMounted,
    newBlocksLoading,
    lastBlockLoading,
    oldBlocksLoading,
  ]);

  useEffect(() => {
    if (newBlocksError) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of new blocks failed',
      });
    }
  }, [newBlocksError]);

  useEffect(() => {
    if (lastBlockError) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of completed blockheights failed',
      });
    }
  }, [lastBlockError]);

  useEffect(() => {
    if (oldBlocksError) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of old blocks failed',
      });
    }
  }, [oldBlocksError]);

  useEffect(() => {
    if (lastBlockHeightData?.lastBlockHeight) {
      const newBlockHeights = Array.from(
        { length: 4 },
        (_, i) => lastBlockHeightData.lastBlockHeight - i,
      ).reverse();

      //updateBlockHeights(newBlockHeights);
      updateBlockHeightsClean(newBlockHeights);
    }
  }, [lastBlockHeightData]);

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
      setmaxBlockTxCount(getMaxBlockTxCount(updatedBlockData));
      if (!newBlocksData.newBlocks) return;

      const newMaxHeight = Math.max(
        ...newBlocksData.newBlocks.map((block) => block.height),
      );

      if (newMaxHeight > blockHeights[3]) {
        const newBlockHeights = Array.from(
          { length: 4 },
          (_, i) => newMaxHeight - i,
        ).reverse();

        //updateBlockHeights(newBlockHeights);
        updateBlockHeightsClean(newBlockHeights);
      }
    }
  }, [newBlocksData]);

  useEffect(() => {
    if (selectedHeight && !blockHeightsClean.includes(selectedHeight?.height)) {
      blockHeightsClean[0] = selectedHeight?.height;
      updateBlockHeights(blockHeightsClean);
    } else {
      updateBlockHeights(blockHeightsClean);
    }
  }, [selectedHeight, newBlocksData]);

  useEffect(() => {
    setQueries([
      {
        query: newBlocks,
      },
      {
        query: lastBlockHeight,
      },
      {
        query: completedBlockHeights,
        variables: completedBlockHeightsVariables,
      },
    ]);
  }, []);

  console.log(inView);
  return (
    <>
      <span ref={ref} style={{ height: 1 }} />
      <Stack
        className={!inView ? blockHeaderFixedClass : ''}
        display="flex"
        flexDirection={'column'}
        paddingInline={{ xs: 'xs', md: 'lg' }}
        width="100%"
        marginBlockEnd="sm"
      >
        <BlockTableHeader
          isLoading={isLoading}
          startColumns={startColumns}
          heightColumns={isLoading ? blockHeightsLoading : blockHeights}
          endColumn={endColumn}
        />
      </Stack>

      <Stack
        display="flex"
        flexDirection={'column'}
        gap={'sm'}
        paddingInline={{ xs: 'xs', md: 'lg' }}
        width="100%"
      >
        {!inView && <Stack marginBlock="xxl" />}
        {Object.keys(isLoading ? blockDataLoading : blockData).map(
          (chainId) => (
            <BlockRow
              isLoading={isLoading}
              key={chainId}
              blockRowData={
                isLoading
                  ? blockDataLoading[Number(chainId)]
                  : blockData[Number(chainId)]
              }
              heights={isLoading ? blockHeightsLoading : blockHeights}
              chainId={Number(chainId)}
              maxBlockTxCount={maxBlockTxCount}
            />
          ),
        )}
      </Stack>
    </>
  );
};
