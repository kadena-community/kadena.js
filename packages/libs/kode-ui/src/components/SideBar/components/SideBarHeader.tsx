import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface ISideBarFooter extends PropsWithChildren {}

export const SideBarFooter: FC<ISideBarFooter> = ({ children }) => {
  return <ul>{children}</ul>;
};
