import type { FC, PropsWithChildren } from 'react';
import { listClass } from './style.css';

export const List: FC<PropsWithChildren> = ({ children }) => {
  return <ul className={listClass}>{children}</ul>;
};
