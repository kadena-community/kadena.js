import * as Layouts from '@/components/Layout';
import { ILayout } from '@/types/Layout';
import { FC } from 'react';

export const getLayout = (layout: string): FC<ILayout> => {
  switch (layout.toLowerCase()) {
    case 'landing':
      return Layouts.Landing;
    case 'codeside':
    case 'code':
      return Layouts.CodeSide;
    default:
      return Layouts.Full;
  }
};
