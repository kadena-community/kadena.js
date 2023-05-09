import * as Layouts from '@/components/Layout';
import { ILayout } from '@/types/Layout';
import { FC } from 'react';

export const getLayout = (layout: string): FC<ILayout> => {
  console.log(layout);
  switch (layout.toLowerCase()) {
    case 'full':
      return Layouts.Full;
    case 'codeside':
    case 'code':
      return Layouts.Code;
    default:
      return Layouts.Landing;
  }
};
