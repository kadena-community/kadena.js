import type { ValidationErrors } from '@react-types/shared';
import type { ComponentPropsWithRef, ElementRef, ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import { FormValidationContext } from 'react-stately';

export interface IFormProps extends ComponentPropsWithRef<'form'> {
  validationErrors?: ValidationErrors;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, react/function-component-definition
function BaseForm(props: IFormProps, ref: ForwardedRef<ElementRef<'form'>>) {
  const { children, validationErrors, ...domProps } = props;
  return (
    <form {...domProps} ref={ref}>
      <FormValidationContext.Provider value={validationErrors ?? {}}>
        {children}
      </FormValidationContext.Provider>
    </form>
  );
}

export const Form = forwardRef(BaseForm);
