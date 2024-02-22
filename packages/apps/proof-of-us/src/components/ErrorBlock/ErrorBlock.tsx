import type { FC, PropsWithChildren } from 'react';
import { errorWrapperClass } from './style.css';

export const ErrorBlock: FC<PropsWithChildren> = ({ children }) => {
  return <div className={errorWrapperClass}>{children}</div>;
};
