import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import React from 'react';
import { selectedClass, tabClass } from './Tabs.css';

export interface ITabProps {
  children: ReactNode;
  selected?: boolean;
  handleClick?: (tabId: string) => void;
  id: string;
}

export const Tab: FC<ITabProps> = ({
  children,
  selected = false,
  handleClick,
  id,
}) => {
  if (handleClick === undefined || id === undefined) return null;
  return (
    <button
      className={classNames(tabClass, { [selectedClass]: selected })}
      data-selected={selected}
      data-tab={id}
      onClick={() => handleClick(id)}
    >
      {children}
    </button>
  );
};
