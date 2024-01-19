import type { FC } from 'react';
import React, { forwardRef } from 'react';
import type { IFormFieldWrapperProps } from '../FormFieldWrapper';
import { FormFieldHeader, FormFieldHelper } from '../FormFieldWrapper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';
import type { ISelectProps } from '../Select';
import { Select } from '../Select';
export interface ISelectFieldProps
  extends Omit<IFormFieldWrapperProps, 'htmlFor'>,
    Omit<ISelectProps, 'disabled' | 'children'> {}

export const SelectField: FC<ISelectFieldProps> = forwardRef<
  HTMLSelectElement,
  ISelectFieldProps
>(function SelectField(
  {
    disabled = false,
    id,
    children,
    helperText,
    label,
    status,
    tag,
    info,
    ...rest
  },
  ref,
) {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <>
      <div className={statusVal ? statusVariant[statusVal] : undefined}>
        {label !== undefined && (
          <FormFieldHeader htmlFor={id} label={label} tag={tag} info={info} />
        )}

        <Select ref={ref} id={id} disabled={disabled} {...rest}>
          {children}
        </Select>

        {Boolean(helperText) && status !== 'negative' && (
          <FormFieldHelper>{helperText}</FormFieldHelper>
        )}
        {Boolean(helperText) && status === 'negative' && (
          <FormFieldHelper>{helperText}</FormFieldHelper>
        )}
      </div>
    </>
  );
});
