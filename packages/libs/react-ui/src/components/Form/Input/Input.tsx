import type { vars } from '@theme/vars.css';
import classNames from 'classnames';
import type { FC, InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import type { FormFieldStatus } from '../Form.css';
import { baseContainerClass, baseOutlinedClass } from '../Form.css';

import {
  disabledClass,
  inputChildrenClass,
  inputClass,
  inputContainerClass,
  leadingTextClass,
  leadingTextWidthVariant,
  leadingTextWrapperClass,
} from './Input.css';

export interface IInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'className' | 'id'
  > {
  leadingText?: string;
  startIcon?: React.ReactElement;
  leadingTextWidth?: keyof typeof vars.sizes;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  ref?: React.ForwardedRef<HTMLInputElement>;
  id: string;
  outlined?: boolean;
  status?: FormFieldStatus;
}

export const Input: FC<IInputProps> = forwardRef<HTMLInputElement, IInputProps>(
  function Input(
    {
      outlined,
      leadingText,
      startIcon,
      leadingTextWidth,
      disabled = false,
      children,
      status,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        className={classNames(baseContainerClass, {
          [baseOutlinedClass]: outlined || status,
          [disabledClass]: disabled,
        })}
      >
        {Boolean(leadingText) && (
          <div
            className={classNames(
              leadingTextWrapperClass,
              leadingTextWidth && leadingTextWidthVariant[leadingTextWidth],
            )}
          >
            <span className={leadingTextClass}>{leadingText}</span>
          </div>
        )}
        <div className={inputContainerClass}>
          {startIcon}
          <input
            ref={ref}
            className={inputClass}
            disabled={disabled}
            {...rest}
          />
          {children && <div className={inputChildrenClass}>{children}</div>}
        </div>
      </div>
    );
  },
);
