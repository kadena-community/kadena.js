import * as Layouts from '@/components/Layout';
import { IBasePageProps, IPageProps } from '@/types/Layout';
import { FC } from 'react';

type IProps = IBasePageProps | IPageProps;

export const getLayout = (layout: string): FC<IProps> => {
  switch (layout.toLowerCase()) {
    case 'full':
      return Layouts.Full as unknown as FC<IProps>;
    case 'blog':
      return Layouts.Blog as unknown as FC<IProps>;
    case 'home':
      return Layouts.Home as unknown as FC<IProps>;
    case 'redocly':
      return Layouts.Redocly as unknown as FC<IProps>;
    default:
      return Layouts.Landing;
  }
};
