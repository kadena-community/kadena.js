import type { FC } from 'react';
import React, { forwardRef } from 'react';

import {
  FormFieldHeader,
  FormFieldHelper,
  IFormFieldWrapperProps,
} from '../FormFieldWrapper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';
import { ITextareaProps, Textarea } from '../Textarea/Textarea';

export interface ITextareaFieldProps
  extends Omit<IFormFieldWrapperProps, 'htmlFor' | 'children'>,
    Omit<ITextareaProps, 'disabled'> {}

export const TextareaField: FC<ITextareaFieldProps> = forwardRef<
  HTMLTextAreaElement,
  ITextareaFieldProps
>(function TextareaField(
  { disabled = false, id, status, tag, info, helperText, label, ...rest },
  ref,
) {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {label !== undefined && (
        <FormFieldHeader htmlFor={id} label={label} tag={tag} info={info} />
      )}

      <Textarea ref={ref} disabled={disabled} id={id} {...rest} />

      {Boolean(helperText) && status !== 'negative' && (
        <FormFieldHelper>{helperText}</FormFieldHelper>
      )}
      {Boolean(helperText) && status === 'negative' && (
        <FormFieldHelper>{helperText}</FormFieldHelper>
      )}
    </div>
  );
});
