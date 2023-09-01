import { Text } from '@kadena/react-ui';

import { textClass } from './styles.css';

import React, { type FC, type ReactNode } from 'react';

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
