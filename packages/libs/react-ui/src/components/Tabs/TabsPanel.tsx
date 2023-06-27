import React, { FC, ReactNode } from 'react';

export interface ITabsPanelProps {
  children: ReactNode;
  selected?: boolean;
  value: string;
}

export const TabsPanel: FC<ITabsPanelProps> = ({
  children,
  selected = false,
}) => {
  if (!selected) return null;

  return <div>{children}</div>;
};
