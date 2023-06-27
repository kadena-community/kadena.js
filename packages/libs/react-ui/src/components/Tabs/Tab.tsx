import React, { FC, ReactNode } from 'react';

export interface ITabProps {
  children: ReactNode;
  selected?: boolean;
  handleClick?: (value: string) => void;
  value: string;
}

export const Tab: FC<ITabProps> = ({
  children,
  selected = false,
  handleClick,
  value,
}) => {
  if (handleClick === undefined || value === undefined) return null;
  return (
    <button data-selected={selected} onClick={() => handleClick(value)}>
      {children}
    </button>
  );
};
