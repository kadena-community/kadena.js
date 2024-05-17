import { Stack } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const CommitTag: FC<PropsWithChildren> = ({ children }) => {
  return <Stack>{children}</Stack>;
};
