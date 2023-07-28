import { BasePageGrid } from '../components';
import { Template } from '../components/Template';

import { IPageProps } from '@/types/Layout';
import React, { FC } from 'react';

export const Home: FC<IPageProps> = ({ children, leftMenuTree }) => {
  return (
    <BasePageGrid>
      <Template menuItems={leftMenuTree} hideSideMenu>
        {children}
      </Template>
    </BasePageGrid>
  );
};

Home.displayName = 'Home';
