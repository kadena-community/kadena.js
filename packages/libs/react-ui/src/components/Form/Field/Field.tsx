import type { FocusableElement, ValidationResult } from '@react-types/shared';
import classNames from 'classnames';
import type { DOMAttributes, ElementRef, ForwardedRef, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { FormFieldHeader } from '..';
import type { InputVariants } from '../Form.css';
import {
  baseContainerClass,
  endAddon as endAddonClass,
  formField,
  startAddon as startAddonClass,
} from '../Form.css';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';

interface IFieldProps {
  children: ReactNode;
  className?: string;
  description?: string | ReactNode;
  descriptionProps: DOMAttributes<FocusableElement>;
  endAddon?: ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
  errorMessageProps: DOMAttributes<FocusableElement>;
  info?: string;
  isInvalid: boolean;
  label?: string | ReactNode;
  labelProps: DOMAttributes<FocusableElement>;
  startAddon?: ReactNode;
  variant: InputVariants['variant'];
  size: NonNullable<InputVariants['size']>;
  tag?: string;
  validationDetails: ValidityState;
  validationErrors: string[];
}

const Field = forwardRef(
  (
    {
      children,
      className,
      description,
      descriptionProps,
      endAddon,
      errorMessage,
      errorMessageProps,
      info,
      label,
      labelProps,
      size,
      startAddon,
      tag,
      validationDetails,
      validationErrors,
      variant,
    }: IFieldProps,
    ref: ForwardedRef<ElementRef<'input' | 'textarea' | 'select'>>,
  ) => {
    const isPositive = variant === 'positive';
    const isInvalid = variant === 'negative';
    // aggregate error message from validation props
    const error =
      typeof errorMessage === 'function'
        ? errorMessage({ isInvalid, validationErrors, validationDetails })
        : errorMessage ?? validationErrors.join(' ');

    return (
      <div className={classNames(formField, className)}>
        {label && (
          <FormFieldHeader
            label={label}
            tag={tag}
            info={info}
            isDisabled={variant === 'readonly'}
            {...labelProps}
          />
        )}
        <div className={baseContainerClass({ variant })}>
          {startAddon && (
            <div
              className={startAddonClass[size]}
              ref={(el) => {
                if (el && ref && 'current' in ref) {
                  ref.current?.style.setProperty(
                    '--start-addon-width',
                    `${el.offsetWidth}px`,
                  );
                }
              }}
            >
              {startAddon}
            </div>
          )}
          {children}
          {endAddon && (
            <div
              className={endAddonClass}
              ref={(el) => {
                if (el && ref && 'current' in ref) {
                  ref.current?.style.setProperty(
                    '--end-addon-width',
                    `${el.offsetWidth}px`,
                  );
                }
              }}
            >
              {endAddon}
            </div>
          )}
        </div>

        {description && !isInvalid && (
          <FormFieldHelpText
            {...descriptionProps}
            intent={isPositive ? 'positive' : 'info'}
          >
            {description}
          </FormFieldHelpText>
        )}
        {isInvalid && (
          <FormFieldHelpText {...errorMessageProps} intent="negative">
            {error || description}
          </FormFieldHelpText>
        )}
      </div>
    );
  },
);

Field.displayName = 'Field';

export { Field };
