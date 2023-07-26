import { Menu } from './Menu';
import { sidebarClass } from './styles.css';
import { Toolbar } from './Toolbar';

import React, { FC } from 'react';

export const Sidebar: FC = () => {
  return (
    <aside className={sidebarClass}>
      <Toolbar />
      <Menu />
    </aside>
  );
};
