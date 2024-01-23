import type { FC } from 'react';
import React, { forwardRef } from 'react';
import type { IFormFieldWrapperProps } from '../FormFieldWrapper';
import { FormFieldHeader, FormFieldHelper } from '../FormFieldWrapper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';
import type { IInputProps } from '../Input';
import { Input } from '../Input';
export interface ITextFieldProps
  extends Omit<IFormFieldWrapperProps, 'children' | 'htmlFor'>,
    Omit<IInputProps, 'disabled' | 'children'> {}

export const TextField: FC<ITextFieldProps> = forwardRef<
  HTMLInputElement,
  ITextFieldProps
>(function TextField(
  { disabled = false, status, id, label, info, tag, helperText, ...inputProps },
  ref,
) {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {label !== undefined && (
        <FormFieldHeader htmlFor={id} label={label} tag={tag} info={info} />
      )}
      <Input ref={ref} disabled={disabled} id={id} {...inputProps} />
      {Boolean(helperText) && status !== 'negative' && (
        <FormFieldHelper>{helperText}</FormFieldHelper>
      )}
      {Boolean(helperText) && status === 'negative' && (
        <FormFieldHelper>{helperText}</FormFieldHelper>
      )}
    </div>
  );
});
