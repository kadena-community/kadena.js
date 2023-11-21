import type { FC, ReactNode } from 'react';
import React from 'react';

export interface ITabContentProps {
  children: ReactNode;
  selected?: boolean;
  id: string;
  className?: string;
}

export const TabContent: FC<ITabContentProps> = ({
  children,
  selected = false,
  ...props
}) => {
  if (!selected) return null;

  return <div {...props}>{children}</div>;
};
