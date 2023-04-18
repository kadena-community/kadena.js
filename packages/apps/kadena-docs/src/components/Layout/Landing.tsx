import { ILayout } from './types';

import React, { FC } from 'react';

export const Landing: FC<ILayout> = ({ children }) => {
  return (
    <>
      <h1>Landing</h1>
      {children}
    </>
  );
};

Landing.displayName = 'Landing';
