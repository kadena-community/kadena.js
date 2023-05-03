import React, { FC, ReactNode } from 'react';

interface IProp {
  children: ReactNode;
}

export const Code: FC<IProp> = ({ children, ...props }) => {
  return (
    <pre>
      <code {...props}>asd{children}</code>
    </pre>
  );
};
