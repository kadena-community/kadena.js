import { Card } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { cardClass } from './styles.css';

interface IProps extends PropsWithChildren {}

export const LayoutCard: FC<IProps> = ({ children }) => {
  return (
    <Card fullWidth className={cardClass}>
      {children}
    </Card>
  );
};
