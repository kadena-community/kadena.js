import routes from '@/constants/routes';
import type { IBlockData } from '@/services/block';
import { Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import {
  headerColumnHeightStyle,
  headerColumnStyle,
} from '../block-header/block-header.css';
import { blockHeightColumnHeaderStyle } from './../block-table.css';

interface IProps {
  height: IBlockData;
  chainId: number;
  onOpenHeight: (height: number, chainId: number, hash: string) => void;
}

const BlockCell: FC<IProps> = ({ height, chainId, onOpenHeight }) => {
  const handleOpenHeight = useCallback(() => {
    if (onOpenHeight) {
      onOpenHeight(height.height, chainId, height.hash);
    }
  }, [height.height, chainId, height.hash, onOpenHeight]);
  return (
    <Stack
      position="relative"
      onClick={handleOpenHeight}
      key={`block-${chainId}-${height}`}
      className={classNames(headerColumnStyle, headerColumnHeightStyle)}
      href={`${routes.BLOCK_DETAILS}/${height.hash}`}
    >
      <Text className={blockHeightColumnHeaderStyle} variant="code" bold>
        {height.txCount}
      </Text>
    </Stack>
  );
};

export default BlockCell;
