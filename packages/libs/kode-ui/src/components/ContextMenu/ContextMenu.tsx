import type { FC, PropsWithChildren, RefObject } from 'react';
import React, { useEffect } from 'react';
import { Stack } from '../Layout';
import { contextMenuClass } from './style.css';

type Position = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type IContextMenuProps = PropsWithChildren & {
  position: Position;
  parentRef: RefObject<HTMLElement>;
};

export const ContextMenu: FC<IContextMenuProps> = ({ children, parentRef }) => {
  useEffect(() => {
    if (!parentRef?.current) return;
  }, [parentRef]);

  return <Stack className={contextMenuClass}>{children}</Stack>;
};
