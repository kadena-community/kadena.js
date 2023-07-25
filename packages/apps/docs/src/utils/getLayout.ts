import * as Layouts from '@/components/Layout';
import { IPageProps } from '@/types/Layout';
import { FC } from 'react';

export const getLayout = (layout: string): FC<IPageProps> => {
  switch (layout.toLowerCase()) {
    case 'full':
      return Layouts.Full;
    case 'blog':
      return Layouts.Blog;
    case 'home':
      return Layouts.Home;
    case 'redocly':
      return Layouts.Redocly;
    default:
      return Layouts.Landing;
  }
};
