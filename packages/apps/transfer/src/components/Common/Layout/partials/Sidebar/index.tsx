import { Menu } from './Menu';
import { Toolbar } from './Toolbar';

import React, { FC } from 'react';

export const Sidebar: FC = () => {
  return (
    <>
      <Toolbar />
      <Menu />
    </>
  );
};
