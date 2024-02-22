import type { FC, PropsWithChildren } from 'react';
import { metalistClass } from './style.css';

export const MetaList: FC<PropsWithChildren> = ({ children }) => (
  <dl className={metalistClass}>{children}</dl>
);
