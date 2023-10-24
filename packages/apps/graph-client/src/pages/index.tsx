import { Box } from '@kadena/react-ui';

import {
  useGetBlocksSubscription,
  useGetRecentHeightsQuery,
  useGetTransactionsQuery,
} from '@/__generated__/sdk';
import { mainStyle } from '@/components/Common/main/styles.css';
import { CompactTransactionsTable } from '@/components/compact-transactions-table/compact-transactions-table';
import { ChainwebGraph } from '@components/chainweb';
import routes from '@constants/routes';
import { useChainTree } from '@context/chain-tree-context';
import { useParsedBlocks } from '@utils/hooks/use-parsed-blocks';
import { usePrevious } from '@utils/hooks/use-previous';
import isEqual from 'lodash.isequal';
import React, { useEffect } from 'react';

const Home: React.FC = () => {
  const { loading: loadingNewBlocks, data: newBlocks } =
    useGetBlocksSubscription();
  const { loading: loadingRecentBlocks, data: recentBlocks } =
    useGetRecentHeightsQuery({ variables: { count: 3 } });
  const previousNewBlocks = usePrevious(newBlocks);
  const previousRecentBlocks = usePrevious(recentBlocks);

  const { data: txs } = useGetTransactionsQuery({ variables: { first: 10 } });

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
    <div>
      <main className={mainStyle}>
        <div>
          {loadingRecentBlocks || loadingNewBlocks ? (
            'Loading...'
          ) : (
            <ChainwebGraph blocks={allBlocks} />
          )}
        </div>

        {txs?.transactions && (
          <div>
            <Box marginBottom="$10" />
            <CompactTransactionsTable
              transactions={txs.transactions}
              viewAllHref={`${routes.TRANSACTIONS}`}
              description="Most recent transactions"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
