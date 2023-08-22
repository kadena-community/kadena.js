import { BasePageGrid } from '../components';
import { Template } from '../components/Template';

import { globalsClass } from './../global.css';

import { IPageProps } from '@/types/Layout';
import React, { FC } from 'react';

export const Home: FC<IPageProps> = ({ children, leftMenuTree }) => {
  return (
    <BasePageGrid className={globalsClass}>
      <Template menuItems={leftMenuTree} hideSideMenu>
        {children}
      </Template>
    </BasePageGrid>
  );
};

Home.displayName = 'Home';
