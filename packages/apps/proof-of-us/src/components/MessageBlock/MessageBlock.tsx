import type { FC, PropsWithChildren } from 'react';
import { Heading } from '../Typography/Heading';
import { errorWrapperClass } from './style.css';

interface IProps extends PropsWithChildren {
  variant?: 'success' | 'error';
  title: string;
}

export const MessageBlock: FC<IProps> = ({
  children,
  title,
  variant = 'success',
}) => {
  return (
    <div data-type={variant} className={errorWrapperClass}>
      <Heading as="h6">{title}</Heading>
      {children}
    </div>
  );
};
