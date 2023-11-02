import { SystemIcon } from '@components/Icon';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { forwardRef, useContext } from 'react';
import type { Status } from '../Form.css';
import { baseOutlinedClass, statusClass } from '../Form.css';
import { InputWrapperContext } from '../InputWrapper/InputWrapper.context';
import {
  chevronIconClass,
  containerClass,
  containerClassDisabled,
  iconClass,
  selectClass,
} from './Select.css';

export interface ISelectProps
  extends Omit<
    React.HTMLAttributes<HTMLSelectElement>,
    'aria-label' | 'as' | 'className' | 'children' | 'id'
  > {
  ariaLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: keyof typeof SystemIcon;
  ref?: React.ForwardedRef<HTMLSelectElement>;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  id: string;
  value?: string;
  outlined?: boolean;
}

export const Select: FC<ISelectProps> = forwardRef<
  HTMLSelectElement,
  ISelectProps
>(function Select(
  { ariaLabel, children, disabled = false, outlined = false, icon, ...rest },
  ref,
) {
  const { status } = useContext(InputWrapperContext);

  const Icon = icon && SystemIcon[icon];
  const ChevronDown = SystemIcon.ChevronDown;

  return (
    <div
      className={classNames(containerClass, {
        [containerClassDisabled]: disabled,
        [statusClass]: status,
        [baseOutlinedClass]: outlined,
      })}
      data-testid="kda-select"
    >
      {Icon && (
        <span className={iconClass}>
          <Icon size="md" />
        </span>
      )}
      <select
        aria-label={ariaLabel}
        className={selectClass}
        disabled={disabled}
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
