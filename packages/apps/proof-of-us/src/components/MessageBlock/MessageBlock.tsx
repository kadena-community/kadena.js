import type { FC, PropsWithChildren } from 'react';
import { errorWrapperClass } from './style.css';

interface IProps extends PropsWithChildren {
  variant?: 'success' | 'error';
}

export const MessageBlock: FC<IProps> = ({ children, variant = 'success' }) => {
  return (
    <div data-type={variant} className={errorWrapperClass}>
      {children}
    </div>
  );
};
