import { Box } from '@kadena/kode-ui';
import type { FC, ReactNode } from 'react';
import { authCard } from './style.css.ts';

interface IProps {
  children: ReactNode;
}

export const AuthCard: FC<IProps> = ({ children }) => {
  return <Box className={authCard}>{children}</Box>;
};
