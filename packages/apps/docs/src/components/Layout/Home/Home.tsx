import { baseGridClass } from '../basestyles.css';
import { Template } from '../components/Template/Template';

import { globalClass } from './../global.css';
import { pageGridClass } from './styles.css';

import type { IPageProps } from '@/Layout';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';

export const Home: FC<IPageProps> = ({ children, leftMenuTree }) => {
  const gridClassNames = classNames(globalClass, baseGridClass, pageGridClass);
  return (
    <div className={gridClassNames}>
      <Template menuItems={leftMenuTree} hideSideMenu>
        {children}
      </Template>
    </div>
  );
};

Home.displayName = 'Home';
