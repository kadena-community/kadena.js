import { atoms } from '@theme/atoms.css';
import classNames from 'classnames';
import type { FC, TextareaHTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import { baseContainerClass, baseOutlinedClass } from '../Form.css';
import { FormFieldWrapperContext } from '../FormFieldWrapper/FormFieldWrapper.context';
import {
  buttonContainerClass,
  disabledClass,
  textAreaClass,
  textAreaContainerClass,
} from './Textarea.css';

export interface ITextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'as' | 'disabled' | 'className' | 'id'
  > {
  id: string;
  fontFamily?: 'primaryFont' | 'codeFont';
  disabled?: boolean;
  ref?: React.ForwardedRef<HTMLTextAreaElement>;
  outlined?: boolean;
}

/**
 * @deprecated Use `TextareaField` instead.
 */
export const Textarea: FC<ITextareaProps> = forwardRef<
  HTMLTextAreaElement,
  ITextareaProps
>(function TextArea(
  { outlined = false, disabled = false, fontFamily, children, ...rest },
  ref,
) {
  const { status } = useContext(FormFieldWrapperContext);

  return (
    <div
      className={classNames(baseContainerClass, textAreaContainerClass, {
        [baseOutlinedClass]: outlined || status,
        [disabledClass]: disabled,
      })}
    >
      <textarea
        ref={ref}
        className={classNames(textAreaClass, atoms({ fontFamily }))}
        disabled={disabled}
        {...rest}
      />
      {children && <div className={buttonContainerClass}>{children}</div>}
    </div>
  );
});
