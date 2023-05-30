import * as Layouts from '@/components/Layout';
import { ILayout } from '@/types/Layout';
import { FC } from 'react';

export const getLayout = (layout: string): FC<ILayout> => {
  switch (layout.toLowerCase()) {
    case 'full':
      return Layouts.Full;
    case 'home':
      return Layouts.Home;
    case 'codeside':
    case 'code':
      return Layouts.Code;
    default:
      return Layouts.Landing;
  }
};
