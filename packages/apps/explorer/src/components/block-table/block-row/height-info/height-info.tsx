import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  hash: string;
}

const HeightInfo: FC<IProps> = ({ hash }) => {
  return <Stack as="section">{hash}</Stack>;
};

export default HeightInfo;
