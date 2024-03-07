import type { FC, PropsWithChildren } from 'react';
import { Heading } from '../Typography/Heading';
import { errorWrapperClass } from './style.css';

interface IProps extends PropsWithChildren {
  variant?: 'success' | 'error' | 'info';
  title?: string;
}

export const MessageBlock: FC<IProps> = ({
  children,
  title,
  variant = 'success',
}) => {
  return (
    <div data-type={variant} className={errorWrapperClass}>
      {title && <Heading as="h6">{title}</Heading>}
      {children}
    </div>
  );
};
