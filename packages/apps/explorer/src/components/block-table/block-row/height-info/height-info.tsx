import type { Transaction } from '@/__generated__/sdk';
import { useBlockQuery } from '@/__generated__/sdk';
import BlockTransactions from '@/components/block-transactions/block-transactions';
import routes from '@/constants/routes';
import type { IBlockData } from '@/services/block';
import { Heading, Stack, TextLink } from '@kadena/kode-ui';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { blockInfoClass } from './styles.css';

interface IProps {
  height?: IBlockData;
}

const HeightInfo: FC<IProps> = ({ height }) => {
  const blockQueryVariables = {
    hash: height?.hash ?? '',
    skip: !height?.hash,
  };

  const { loading, data, error } = useBlockQuery({
    variables: blockQueryVariables,
  });

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
        transactions={
          data?.block?.transactions.edges.map(
            (edge) => edge.node as Transaction,
          ) ?? []
        }
      />
    </Stack>
  );
};

export default HeightInfo;
