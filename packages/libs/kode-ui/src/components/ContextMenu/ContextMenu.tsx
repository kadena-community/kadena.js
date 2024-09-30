import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { Stack } from '../Layout';
import { contextMenuClass } from './style.css';

export const ContextMenu: FC<PropsWithChildren> = ({ children }) => {
  return <Stack className={contextMenuClass}>{children}</Stack>;
};
