import type { FC } from 'react';
import React from 'react';
import { Menu } from './Menu';
import { Toolbar } from './Toolbar';

export const Sidebar: FC = () => {
  return (
    <>
      <Toolbar />
      <Menu />
    </>
  );
};
