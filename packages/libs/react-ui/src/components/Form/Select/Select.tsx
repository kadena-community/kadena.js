import classNames from 'classnames';
import type { FC } from 'react';
import React, { forwardRef, useContext } from 'react';
import { SystemIcon } from '../../Icon';
import { baseOutlinedClass } from '../Form.css';
import { FormFieldWrapperContext } from '../FormFieldWrapper/FormFieldWrapper.context';
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
  startIcon?: React.ReactElement;
  ref?: React.ForwardedRef<HTMLSelectElement>;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  id: string;
  value?: string;
  outlined?: boolean;
}

/**
 * @deprecated Use `SelectField` instead.
 */
export const Select: FC<ISelectProps> = forwardRef<
  HTMLSelectElement,
  ISelectProps
>(function Select(
  {
    ariaLabel,
    children,
    disabled = false,
    outlined = false,
    startIcon,
    ...rest
  },
  ref,
) {
  const { status } = useContext(FormFieldWrapperContext);
  const ChevronDown = SystemIcon.ChevronDown;

  return (
    <div
      className={classNames(containerClass, {
        [containerClassDisabled]: disabled,
        [baseOutlinedClass]: outlined || status,
      })}
      data-testid="kda-select"
    >
      {startIcon && <span className={iconClass}>{startIcon}</span>}
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
