import { ILayout } from '@/types/Layout';
import React, { FC } from 'react';
import { RedocStandalone } from 'redoc';
import spec from '../../../specs/chainweb/chainweb.openapi.json';

export const Home: FC<ILayout> = ({ children }) => {
  return (
    <>
      <RedocStandalone spec={spec} />
      {children}
    </>
  );
};

Home.displayName = 'Home';
