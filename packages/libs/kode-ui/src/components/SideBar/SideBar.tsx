import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface ISideBar extends PropsWithChildren {}

export const SideBar: FC<ISideBar> = ({ children }) => {
  return <aside>{children}</aside>;
};
