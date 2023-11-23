import type { Sprinkles } from '@theme/sprinkles.css';
import { sprinkles } from '@theme/sprinkles.css';
import classNames from 'classnames';
import type { FC, TextareaHTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import { baseContainerClass, baseOutlinedClass } from '../Form.css';
import { FormFieldWrapperContext } from '../FormFieldWrapper/FormFieldWrapper.context';
import {
  disabledClass,
  textAreaClass,
  textAreaContainerClass,
} from './Textarea.css';

export interface ITextareaProps
  extends Omit<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      'as' | 'disabled' | 'children' | 'className' | 'id'
    >,
    Partial<Pick<Sprinkles, 'fontFamily'>> {
  id: string;
  disabled?: boolean;
  ref?: React.ForwardedRef<HTMLTextAreaElement>;
  outlined?: boolean;
}

export const Textarea: FC<ITextareaProps> = forwardRef<
  HTMLTextAreaElement,
  ITextareaProps
>(function TextArea(
  { outlined = false, disabled = false, fontFamily, ...rest },
  ref,
) {
  const { status } = useContext(FormFieldWrapperContext);

  return (
    <div
      className={classNames(baseContainerClass, {
        [baseOutlinedClass]: outlined || status,
        [disabledClass]: disabled,
      })}
    >
      <div className={textAreaContainerClass}>
        <textarea
          ref={ref}
          className={classNames(textAreaClass, sprinkles({ fontFamily }))}
          disabled={disabled}
          {...rest}
        />
      </div>
    </div>
  );
});
