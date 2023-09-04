import { baseGridClass } from '../basestyles.css';
import { Template } from '../components/Template';

import { globalClass } from './../global.css';

import { IPageProps } from '@/types/Layout';
import classnames from 'classnames';
import React, { FC } from 'react';

export const Home: FC<IPageProps> = ({ children, leftMenuTree }) => {
  const gridClassNames = classnames(globalClass, baseGridClass);
  return (
    <div className={gridClassNames}>
      <Template menuItems={leftMenuTree} hideSideMenu>
        {children}
      </Template>
    </div>
  );
};

Home.displayName = 'Home';
