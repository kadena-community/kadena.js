import type { IPageProps } from '@kadena/docs-tools';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { baseGridClass } from '../basestyles.css';
import { Template } from '../components/Template/Template';
import { globalClass } from './../global.css';

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
