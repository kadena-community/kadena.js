import BlockTransactions from '@/components/block-transactions/block-transactions';
import Link from '@/components/routing/link';
import routes from '@/constants/routes';
import type { IBlockData } from '@/services/block';
import { Heading, Stack, TextLink } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { blockInfoClass } from './styles.css';

interface IProps {
  height?: IBlockData;
}

const HeightInfo: FC<IProps> = ({ height }) => {
  if (!height) return null;

  return (
    <Stack
      as="section"
      className={blockInfoClass}
      width="100%"
      flexDirection="column"
    >
      <Stack alignItems="center" paddingInlineEnd="md">
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

      <BlockTransactions hash={height.hash} />
    </Stack>
  );
};

export default HeightInfo;
