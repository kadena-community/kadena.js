import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export interface ISideBarHeader extends PropsWithChildren {}

export const SideBarHeader: FC<ISideBarHeader> = ({ children }) => {
  return (
    <header>
      <ul>{children}</ul>
    </header>
  );
};
