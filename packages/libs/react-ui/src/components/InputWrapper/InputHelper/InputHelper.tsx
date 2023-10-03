import { helperClass, helperIconClass } from './InputHelper.css';

import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
import React from 'react';

export interface IInputHelperProps {
  children: React.ReactNode;
}

export const InputHelper: FC<IInputHelperProps> = ({ children }) => {
  return (
    <span className={helperClass}>
      <span className={helperIconClass}>
        <SystemIcon.AlertBox size="sm" />
      </span>
      {children}
    </span>
  );
};
