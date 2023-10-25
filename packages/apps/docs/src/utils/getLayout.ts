import { Blog } from '@/components/Layout/Blog/Blog';
import { Full } from '@/components/Layout/Full/Full';
import { Home } from '@/components/Layout/Home/Home';
import { Landing } from '@/components/Layout/Landing/Landing';
import { Redocly } from '@/components/Layout/Redocly/Redocly';
import type { IBasePageProps, IPageProps } from '@/Layout';
import type { FC } from 'react';

type IProps = IBasePageProps | IPageProps;

export const getLayout = (layout: string): FC<IProps> => {
  switch (layout.toLowerCase()) {
    case 'full':
      return Full as unknown as FC<IProps>;
    case 'blog':
      return Blog as unknown as FC<IProps>;
    case 'home':
      return Home as unknown as FC<IProps>;
    case 'redocly':
      return Redocly as unknown as FC<IProps>;
    default:
      return Landing;
  }
};
