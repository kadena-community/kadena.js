import { baseGridClass } from '../basestyles.css';
import { Template } from '../components/Template';

import { globalClass } from './../global.css';

import { type IPageProps } from '@/types/Layout';
import classNames from 'classnames';
import React, { type FC } from 'react';

export const Home: FC<IPageProps> = ({ children, leftMenuTree }) => {
  const gridClassNames = classNames(globalClass, baseGridClass);
  return (
    <div className={gridClassNames}>
      <Template menuItems={leftMenuTree} hideSideMenu>
        {children}
      </Template>
    </div>
  );
};

Home.displayName = 'Home';
