import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { Menu } from './Menu';
import { Toolbar } from './Toolbar';
import { sidebarClass } from './styles.css';

export const Sidebar: FC = () => {
  return (
    <div className={classNames(sidebarClass)}>
      <Toolbar />
      <Menu />
    </div>
  );
};
