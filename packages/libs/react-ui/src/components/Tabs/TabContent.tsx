import React, { type FC, type ReactNode } from 'react';

export interface ITabContentProps {
  children: ReactNode;
  selected?: boolean;
  value: string;
}

export const TabContent: FC<ITabContentProps> = ({
  children,
  selected = false,
}) => {
  if (!selected) return null;

  return <div>{children}</div>;
};
