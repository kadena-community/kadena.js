import { Stack } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { commitTagClass } from './styles.css';

export const CommitTag: FC<PropsWithChildren> = ({ children }) => {
  return <Stack className={commitTagClass}>{children}</Stack>;
};
