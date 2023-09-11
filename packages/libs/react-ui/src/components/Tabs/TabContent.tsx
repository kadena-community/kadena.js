import type { FC, ReactNode } from 'react';
import React from 'react';

export interface ITabContentProps {
  children: ReactNode;
  selected?: boolean;
  id: string;
}

export const TabContent: FC<ITabContentProps> = ({
  children,
  selected = false,
}) => {
  if (!selected) return null;

  return <div>{children}</div>;
};
