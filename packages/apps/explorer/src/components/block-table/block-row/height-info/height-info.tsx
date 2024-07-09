import type { BlockQuery, Transaction } from '@/__generated__/sdk';
import { useBlockQuery } from '@/__generated__/sdk';
import BlockTransactions from '@/components/block-transactions/block-transactions';
import { loadingData } from '@/components/loading-skeleton/loading-data/loading-data-blockquery';
import Link from '@/components/routing/link';
import routes from '@/constants/routes';
import type { IBlockData } from '@/services/block';
import { Heading, Stack, TextLink } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { blockInfoClass } from './styles.css';

interface IProps {
  height?: IBlockData;
}

const HeightInfo: FC<IProps> = ({ height }) => {
  const [innerData, setInnerData] = useState<BlockQuery>(loadingData);
  const [isLoading, setIsLoading] = useState(true);

  const blockQueryVariables = {
    hash: height?.hash ?? '',
    skip: !height?.hash,
  };

  const { loading, data, error } = useBlockQuery({
    variables: blockQueryVariables,
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);
        setInnerData(data);
      }, 200);
    }
  }, [loading, data]);

  if (!height) return null;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Stack
      as="section"
      className={blockInfoClass}
      width="100%"
      flexDirection="column"
      gap="xs"
    >
      <Stack alignItems="center">
        <Heading as="h6">Block {height.height}</Heading>

        <Stack flex={1} />
        <Link
          href={`${routes.BLOCK_DETAILS}/${height.hash}`}
          legacyBehavior
          passHref
        >
          <TextLink>See all details</TextLink>
        </Link>
      </Stack>

      <BlockTransactions
        isLoading={isLoading}
        transactions={
          innerData?.block?.transactions.edges.map(
            (edge) => edge.node as Transaction,
          ) ?? []
        }
      />
    </Stack>
  );
};

export default HeightInfo;
