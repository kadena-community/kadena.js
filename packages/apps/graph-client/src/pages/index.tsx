import { Box } from '@kadena/react-ui';

import type { QueryTransactionsConnection } from '@/__generated__/sdk';
import {
  useGetBlocksSubscription,
  useGetRecentHeightsQuery,
  useGetTransactionsQuery,
} from '@/__generated__/sdk';
import { centerBlockStyle } from '@/components/Common/center-block/styles.css';
import LoaderAndError from '@/components/LoaderAndError/loader-and-error';
import { CompactTransactionsTable } from '@/components/compact-transactions-table/compact-transactions-table';
import { ChainwebGraph } from '@components/chainweb';
import routes from '@constants/routes';
import { useChainTree } from '@context/chain-tree-context';
import { useParsedBlocks } from '@utils/hooks/use-parsed-blocks';
import { usePrevious } from '@utils/hooks/use-previous';
import isEqual from 'lodash.isequal';
import React, { useEffect } from 'react';

const Home: React.FC = () => {
  const {
    loading: loadingNewBlocks,
    data: newBlocks,
    error: newBlocksError,
  } = useGetBlocksSubscription();
  const {
    loading: loadingRecentBlocks,
    data: recentBlocks,
    error: recentBlocksError,
  } = useGetRecentHeightsQuery({ variables: { count: 3 } });
  const previousNewBlocks = usePrevious(newBlocks);
  const previousRecentBlocks = usePrevious(recentBlocks);

  const {
    loading: loadingTxs,
    data: txs,
    error: txError,
  } = useGetTransactionsQuery({ variables: { first: 10 } });

  const { allBlocks, addBlocks } = useParsedBlocks();

  const { addBlockToChain } = useChainTree();

  useEffect(() => {
    if (
      isEqual(previousNewBlocks, newBlocks) === false &&
      newBlocks?.newBlocks &&
      newBlocks?.newBlocks?.length > 0
    ) {
      newBlocks.newBlocks.forEach(async (block) => {
        addBlockToChain(block);
      });
      addBlocks(newBlocks?.newBlocks);
    }
  }, [newBlocks, addBlocks, previousNewBlocks, addBlockToChain]);

  useEffect(() => {
    if (
      isEqual(previousRecentBlocks, recentBlocks) === false &&
      recentBlocks?.completedBlockHeights &&
      recentBlocks?.completedBlockHeights?.length > 0
    ) {
      recentBlocks.completedBlockHeights.forEach(async (block) => {
        addBlockToChain(block);
      });

      addBlocks(recentBlocks?.completedBlockHeights);
    }
  }, [recentBlocks, addBlocks, previousRecentBlocks, addBlockToChain]);

  return (
    <>
      <LoaderAndError
        error={newBlocksError || recentBlocksError || txError}
        loading={loadingNewBlocks}
        loaderText="Loading..."
      />

      <div className={centerBlockStyle}>
        {allBlocks && <ChainwebGraph blocks={allBlocks} />}
      </div>

      {txs?.transactions && (
        <div>
          <Box marginBottom="$10" />
          <CompactTransactionsTable
            transactions={txs.transactions as QueryTransactionsConnection}
            viewAllHref={`${routes.TRANSACTIONS}`}
            description="Most recent transactions"
          />
        </div>
      )}
    </>
  );
};

export default Home;
