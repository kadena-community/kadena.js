import { ILayout } from '@/types/Layout';
import { FC } from 'react';

export const Home: FC<ILayout> = ({ children }) => {
  return children;
};

Home.displayName = 'Home';
