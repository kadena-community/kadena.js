import * as Layouts from '@/components/Layout';
import { ILayout } from '@/components/Layout/types';
import { FC } from 'react';

export const getLayout = (layout: string): FC<ILayout> => {
  switch (layout.toLowerCase()) {
    case 'full':
      return Layouts.Full;
    case 'codeside':
    case 'code':
      return Layouts.CodeSide;
    default:
      return Layouts.Landing;
  }
};
