import type { IBlockData } from '@/services/block';
import { Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import {
  headerColumnHeightStyle,
  headerColumnStyle,
} from '../block-header/block-header.css';
import { useBlockInfo } from '../block-info-context/block-info-context';
import { blockHeightColumnHeaderStyle } from './../block-table.css';

interface IProps {
  height: IBlockData;
  chainId: number;
}

const BlockCell: FC<IProps> = ({ height, chainId }) => {
  const { handleOpenHeightBlock } = useBlockInfo();

  const handleOpenHeight = useCallback(() => {
    if (handleOpenHeightBlock) {
      handleOpenHeightBlock(height.height, chainId, height.hash);
    }
  }, [height.height, chainId, height.hash, handleOpenHeightBlock]);
  return (
    <Stack
      position="relative"
      onClick={handleOpenHeight}
      key={`block-${chainId}-${height}`}
      className={classNames(headerColumnStyle, headerColumnHeightStyle)}
    >
      <Text className={blockHeightColumnHeaderStyle} variant="code" bold>
        {height.txCount}
      </Text>
    </Stack>
  );
};

export default BlockCell;
