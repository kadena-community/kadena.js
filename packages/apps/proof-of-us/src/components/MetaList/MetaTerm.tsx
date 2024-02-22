import type { FC, PropsWithChildren } from 'react';
import { metatermClass } from './style.css';

export const MetaTerm: FC<PropsWithChildren> = ({ children }) => (
  <dt className={metatermClass}>{children}</dt>
);
