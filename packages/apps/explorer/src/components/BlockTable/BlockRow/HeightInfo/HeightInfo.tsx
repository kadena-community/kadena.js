import { BlockTransactions } from '@/components/BlockTransactions/BlockTransactions';
import { DataRenderComponent } from '@/components/DataRenderComponent/DataRenderComponent';
// import Link from '@/components/routing/link';
import routes from '@/constants/routes';
import type { IBlockData } from '@/services/block';
import {
  // Heading,
  Stack,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { blockInfoClass } from './styles.css';

interface IProps {
  blockData?: IBlockData;
}

export const HeightInfo: FC<IProps> = ({ blockData }) => {
  if (!blockData) return null;

  return (
    <Stack
      as="section"
      className={blockInfoClass}
      width="100%"
      flexDirection="column"
    >
      <Stack alignItems="center" paddingInlineEnd="md">
        <DataRenderComponent
          type="horizontal"
          fields={[
            {
              key: 'Chain',
              value: blockData.chainId.toString(10),
            },
            {
              key: 'Height',
              value: blockData.height.toString(),
            },
            {
              key: 'Hash',
              value: blockData.hash,
              link: `${routes.BLOCK_DETAILS}/${blockData.hash}`,
            },
          ]}
        />

        <Stack flex={1} />
      </Stack>

      <BlockTransactions hash={blockData.hash} />
    </Stack>
  );
};
