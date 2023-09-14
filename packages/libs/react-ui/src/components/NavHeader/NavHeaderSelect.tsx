import {
  chevronIconClass,
  selectClass,
  selectContainerClass,
  selectContainerClassDisabled,
  selectIconClass,
} from './NavHeader.css';

import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { forwardRef } from 'react';

export interface INavHeaderSelectProps
  extends Omit<
    React.HTMLAttributes<HTMLSelectElement>,
    'aria-label' | 'as' | 'className' | 'children' | 'id'
  > {
  ariaLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: keyof typeof SystemIcon;
  ref?: React.ForwardedRef<HTMLSelectElement>;
  id: string;
  value?: string;
}

export const NavHeaderSelect: FC<INavHeaderSelectProps> = forwardRef<
  HTMLSelectElement,
  INavHeaderSelectProps
>(function Select(
  { ariaLabel, children, disabled = false, icon, ...rest },
  ref,
) {
  const Icon = icon && SystemIcon[icon];
  const ChevronDown = SystemIcon.ChevronDown;

  return (
    <div
      className={classNames(selectContainerClass, {
        [selectContainerClassDisabled]: disabled,
      })}
    >
      {Icon && (
        <span className={selectIconClass}>
          <Icon size="md" />
        </span>
      )}
      <select
        aria-label={ariaLabel}
        className={selectClass}
        disabled={Boolean(disabled)}
        ref={ref}
        {...rest}
      >
        {children}
      </select>
      <span className={chevronIconClass}>
        <ChevronDown size="md" />
      </span>
    </div>
  );
});
