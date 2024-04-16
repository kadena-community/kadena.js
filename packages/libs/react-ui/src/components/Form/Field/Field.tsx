import type { FocusableElement, ValidationResult } from '@react-types/shared';
import classNames from 'classnames';
import type { DOMAttributes, ElementRef, ReactNode, RefObject } from 'react';
import React from 'react';
import { FormFieldHeader } from '..';
import type { InputVariants } from '../Form.css';
import {
  baseContainerClass,
  endAddon as endAddonClass,
  formField,
  inputContainer as inputContainerClass,
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
  ref: RefObject<ElementRef<'input' | 'textarea' | 'select'>>;
  startAddon?: ReactNode;
  variant: InputVariants['variant'];
  tag?: string;
  validationDetails: ValidityState;
  validationErrors: string[];
}

const Field = ({
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
  ref,
  startAddon,
  variant,
  tag,
  validationDetails,
  validationErrors,
}: IFieldProps) => {
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
      <div className={inputContainerClass}>
        {startAddon && (
          <div
            className={startAddonClass}
            ref={(el) => {
              if (el) {
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
        <div className={baseContainerClass({ variant })}>{children}</div>
        {endAddon && (
          <div
            className={endAddonClass}
            ref={(el) => {
              if (el) {
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
          {error}
        </FormFieldHelpText>
      )}
    </div>
  );
};

export { Field };
