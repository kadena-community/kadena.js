import { code, codeLine, inlineCode } from './style.css';

import type { FC, ReactNode } from 'react';
import React from 'react';

interface IProp {
  children: ReactNode;
}

export const Code: FC<IProp> = ({ children, ...props }) => {
  if (typeof children === 'string') {
    return <code className={inlineCode}>{children}</code>;
  }

  return (
    <code className={code} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child) || !child) {
          return null;
        }

        return React.cloneElement(child, {
          ...child.props,
          className: codeLine,
        });
      })}
    </code>
  );
};
