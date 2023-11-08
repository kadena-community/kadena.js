import { SystemIcon } from '@components/Icon';
import type { vars } from '@theme/vars.css';
import classNames from 'classnames';
import type { FC, InputHTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import { baseContainerClass, baseOutlinedClass } from '../Form.css';
import { FormFieldWrapperContext } from '../FormFieldWrapper/FormFieldWrapper.context';
import { formFieldContainerClass } from '../FormFieldWrapper/FormFieldWrapper.css';
import {
  disabledClass,
  inputClass,
  inputContainerClass,
  leadingTextClass,
  leadingTextWidthVariant,
  leadingTextWrapperClass,
} from './Input.css';

export interface IInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'as' | 'disabled' | 'children' | 'className' | 'id'
  > {
  leadingText?: string;
  icon?: keyof typeof SystemIcon;
  rightIcon?: keyof typeof SystemIcon;
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
      rightIcon,
      leadingTextWidth: propLeadingTextWidth,
      disabled = false,
      ...rest
    },
    ref,
  ) {
    const { status, leadingTextWidth: wrapperLeadingTextWidth } = useContext(
      FormFieldWrapperContext,
    );

    const leadingTextWidth = propLeadingTextWidth || wrapperLeadingTextWidth;

    const RightIcon = rightIcon && SystemIcon[rightIcon];
    const Icon = icon && SystemIcon[icon];

    return (
      <div
        className={classNames(baseContainerClass, formFieldContainerClass, {
          [baseOutlinedClass]: outlined || status,
          [disabledClass]: disabled,
        })}
        data-testid="kda-input"
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
          {RightIcon && <RightIcon size="md" />}
        </div>
      </div>
    );
  },
);
