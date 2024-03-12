import classNames from 'classnames';
import type { ComponentPropsWithoutRef, FC, PropsWithChildren } from 'react';
import { buttonClass } from './style.css';

type IProps = PropsWithChildren & ComponentPropsWithoutRef<'button'>;

export const IconButton: FC<IProps> = ({ children, ...props }) => {
  return (
    <button {...props} className={classNames(buttonClass, props.className)}>
      {children}
    </button>
  );
};
