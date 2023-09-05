import { selectedClass, tabClass } from './Tabs.css';

import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';

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
    <button
      className={classNames(tabClass, { [selectedClass]: selected })}
      data-selected={selected}
      data-value={value}
      onClick={() => handleClick(value)}
    >
      {children}
    </button>
  );
};
