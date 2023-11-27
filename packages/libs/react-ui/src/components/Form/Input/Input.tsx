import { SystemIcon } from '@components/Icon';
import type { vars } from '@theme/vars.css';
import classNames from 'classnames';
import type { FC, InputHTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import { baseContainerClass, baseOutlinedClass } from '../Form.css';
import { FormFieldWrapperContext } from '../FormFieldWrapper/FormFieldWrapper.context';
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
  icon?: keyof typeof SystemIcon;
  leadingTextWidth?: keyof typeof vars.sizes;
  disabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  ref?: React.ForwardedRef<HTMLInputElement>;
  id: string;
  outlined?: boolean;
}

export const Input: FC<IInputProps> = forwardRef<HTMLInputElement, IInputProps>(
  function Input(
    {
      outlined,
      leadingText,
      icon,
      leadingTextWidth: propLeadingTextWidth,
      disabled = false,
      children,
      ...rest
    },
    ref,
  ) {
    const { status, leadingTextWidth: wrapperLeadingTextWidth } = useContext(
      FormFieldWrapperContext,
    );
    const leadingTextWidth = propLeadingTextWidth || wrapperLeadingTextWidth;
    const Icon = icon && SystemIcon[icon];

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
          {Icon && <Icon size="md" />}
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
