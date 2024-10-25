import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface ISideBarNavigation extends PropsWithChildren {}

export const SideBarNavigation: FC<ISideBarNavigation> = ({ children }) => {
  return <ul>{children}</ul>;
};
