import type { IBlockData } from '@/services/block';
import { Stack, Text } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import {
  headerColumnHeightStyle,
  headerColumnSelectedStyle,
  headerColumnStyle,
} from '../block-header/block-header.css';
import { useBlockInfo } from '../block-info-context/block-info-context';
import {
  blockCaratStyle,
  blockHeightColumnHeaderStyle,
} from './../block-table.css';

interface IProps {
  height: IBlockData;
  chainId: number;
  isSelected?: boolean;
}

const BlockCell: FC<IProps> = ({ height, chainId, isSelected }) => {
  const { handleOpenHeightBlock } = useBlockInfo();

  const handleOpenHeight = useCallback(() => {
    if (handleOpenHeightBlock) {
      handleOpenHeightBlock(chainId, height);
    }
  }, [chainId, height.hash, handleOpenHeightBlock]);
  return (
    <Stack
      position="relative"
      onClick={handleOpenHeight}
      key={`block-${chainId}-${height}`}
      className={classNames(headerColumnStyle, headerColumnHeightStyle, {
        [headerColumnSelectedStyle]: isSelected,
      })}
    >
      <Text
        as="span"
        className={blockHeightColumnHeaderStyle}
        variant="code"
        bold
      >
        {height.txCount}
      </Text>
      {isSelected && <span className={blockCaratStyle} />}
    </Stack>
  );
};

export default BlockCell;
