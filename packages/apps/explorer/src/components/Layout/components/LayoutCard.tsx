import { Card, Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { cardClass, cardContentWrapperClass } from './styles.css';

interface IProps extends PropsWithChildren {}

export const LayoutCard: FC<IProps> = ({ children }) => {
  return (
    <Card fullWidth className={cardClass}>
      <Stack className={cardContentWrapperClass}>{children}</Stack>
    </Card>
  );
};
