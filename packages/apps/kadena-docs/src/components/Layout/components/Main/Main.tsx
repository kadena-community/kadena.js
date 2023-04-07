import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  ref: React.ForwardedRef<HTMLDivElement>;
}

export const Main: FC<IProps> = React.forwardRef(({ children }, ref) => {
  return (
    <>
      <main ref={ref}>{children}</main>
    </>
  );
});
Main.displayName = 'Main';
