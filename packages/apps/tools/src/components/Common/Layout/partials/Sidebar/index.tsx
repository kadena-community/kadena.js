import { darkThemeClass } from '@kadena/react-ui/theme';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { Menu } from './Menu';
import { Toolbar } from './Toolbar';
import { sidebarClass } from './styles.css';

export const Sidebar: FC = () => {
  return (
    <aside className={classNames(sidebarClass, darkThemeClass)}>
      <Toolbar />
      <Menu />
    </aside>
  );
};
