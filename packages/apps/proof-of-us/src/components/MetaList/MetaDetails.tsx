import type { FC, PropsWithChildren } from 'react';
import { metadetailsClass } from './style.css';

export const MetaDetails: FC<PropsWithChildren> = ({ children }) => (
  <dd className={metadetailsClass}>{children}</dd>
);
