import type { FC, ReactElement } from 'react';
import React from 'react';
import type { AriaButtonProps } from 'react-aria';
import { sidebarTreeWrapperClass } from './sidebartree.css';

export type ISideBarTreeWrapperProps = AriaButtonProps<'button'> & {
  startVisual?: ReactElement;
};

export const SideBarTreeWrapper: FC<ISideBarTreeWrapperProps> = ({
  children,
  startVisual,
  ...props
}) => {
  return (
    <button {...props} className={sidebarTreeWrapperClass}>
      {startVisual ?? startVisual}
      {children}
    </button>
  );
};
