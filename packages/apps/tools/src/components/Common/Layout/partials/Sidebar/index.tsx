import { darkThemeClass } from '@kadena/react-ui/theme';

import { Menu } from './Menu';
import { sidebarClass } from './styles.css';
import { Toolbar } from './Toolbar';

import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export const Sidebar: FC = () => {
  return (
    <aside className={classNames(sidebarClass, darkThemeClass)}>
      <Toolbar />
      <Menu />
    </aside>
  );
};
