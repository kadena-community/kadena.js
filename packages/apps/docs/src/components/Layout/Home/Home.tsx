import { BasePageGrid } from '../components/styles';
import { Template } from '../components/Template';

import { globalClass } from './../global.css';

import { IPageProps } from '@/types/Layout';
import React, { FC } from 'react';

export const Home: FC<IPageProps> = ({ children, leftMenuTree }) => {
  return (
    <BasePageGrid className={globalClass}>
      <Template menuItems={leftMenuTree} hideSideMenu>
        {children}
      </Template>
    </BasePageGrid>
  );
};

Home.displayName = 'Home';
