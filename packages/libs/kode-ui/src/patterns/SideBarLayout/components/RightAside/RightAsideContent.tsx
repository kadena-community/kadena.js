import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Stack } from './../../../../components';
import { rightAsideContentClass } from './style.css';

export const RightAsideContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack as="main" className={rightAsideContentClass}>
      {children}
    </Stack>
  );
};
