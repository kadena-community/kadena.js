import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { blockInfoClass } from './styles.css';

interface IProps {
  hash?: string;
}

const HeightInfo: FC<IProps> = ({ hash }) => {
  return (
    <Stack as="section" className={blockInfoClass} width="100%">
      {hash}
    </Stack>
  );
};

export default HeightInfo;
