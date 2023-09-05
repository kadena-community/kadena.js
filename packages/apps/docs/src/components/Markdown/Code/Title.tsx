import { codeTitle, codeWrapper } from './style.css';

import type { FC, ReactNode } from 'react';
import React from 'react';

interface IProp {
  children: ReactNode;
}

export const TitleWrapper: FC<IProp> = ({ children, ...props }) => {
  if (props.hasOwnProperty('data-rehype-pretty-code-fragment')) {
    return (
      <div className={codeWrapper} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={codeTitle} {...props}>
      {children}
    </div>
  );
};
