import { Text } from '@kadena/kode-ui';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { textClass } from './styles.css';

interface IProps {
  children?: ReactNode;
}

export const FooterText: FC<IProps> = ({ children }) => {
  return (
    <Text size="small">
      <span className={textClass}>{children}</span>
    </Text>
  );
};
