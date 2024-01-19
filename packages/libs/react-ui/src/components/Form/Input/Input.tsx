import classNames from 'classnames';
import type { FC, InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import type { FormFieldStatus } from '../Form.css';
import { baseContainerClass, baseOutlinedClass } from '../Form.css';

import { atoms } from '../../../styles/atoms.css';
import {
  disabledClass,
  inputChildrenClass,
  inputClass,
  inputContainerClass,
  leadingTextClass,
  leadingTextWrapperClass,
} from './Input.css';

export interface IInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'as' | 'id'> {
  leadingText?: string;
  startIcon?: React.ReactElement;
  type?: React.HTMLInputTypeAttribute;
  ref?: React.ForwardedRef<HTMLInputElement>;
  id: string;
  outlined?: boolean;
  status?: FormFieldStatus;
  fontFamily?: 'primaryFont' | 'codeFont';
}

/**
 * @deprecated Use `TextField` instead.
 */
export const Input: FC<IInputProps> = forwardRef<HTMLInputElement, IInputProps>(
  function Input(
    {
      outlined,
      leadingText,
      startIcon,
      disabled = false,
      children,
      status,
      className,
      fontFamily = 'primaryFont',
      ...rest
    },
    ref,
  ) {
    return (
      <div
        className={classNames(
          baseContainerClass,
          {
            [baseOutlinedClass]: outlined || status,
            [disabledClass]: disabled,
          },
          className,
        )}
      >
        {Boolean(leadingText) && (
          <div className={classNames(leadingTextWrapperClass)}>
            <span className={leadingTextClass}>{leadingText}</span>
          </div>
        )}
        <div className={inputContainerClass}>
          {startIcon}
          <input
            ref={ref}
            className={classNames(inputClass, atoms({ fontFamily }))}
            disabled={disabled}
            {...rest}
          />
          {children && <div className={inputChildrenClass}>{children}</div>}
        </div>
      </div>
    );
  },
);
