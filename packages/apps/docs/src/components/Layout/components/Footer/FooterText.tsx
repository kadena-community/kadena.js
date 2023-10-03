import { Text } from '@kadena/react-ui';

import { textClass } from './styles.css';

import type { FC, ReactNode } from 'react';
import React from 'react';

interface IProps {
  children?: ReactNode;
}

export const FooterText: FC<IProps> = ({ children }) => {
  return (
    <Text size="md" bold={false}>
      <span className={textClass}>{children}</span>
    </Text>
  );
};
