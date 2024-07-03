import type { IBlockData } from '@/services/block';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { blockInfoClass } from './styles.css';

interface IProps {
  height: IBlockData;
}

const HeightInfo: FC<IProps> = ({ height }) => {
  return (
    <Stack as="section" className={blockInfoClass} width="100%">
      {height.hash}
    </Stack>
  );
};

export default HeightInfo;
