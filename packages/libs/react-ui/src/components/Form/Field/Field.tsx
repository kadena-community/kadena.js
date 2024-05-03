import type { FocusableElement, ValidationResult } from '@react-types/shared';
import classNames from 'classnames';
import type { DOMAttributes, ElementRef, ForwardedRef, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import { FormFieldHeader } from '..';
import type { InputVariants } from '../Form.css';
import {
  baseContainerClass,
  endAddonStyles,
  formField,
  startAddonSize,
  startAddonStyles,
} from '../Form.css';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';

interface IFieldProps {
  children: ReactNode;
  className?: string;
  description?: string | ReactNode;
  descriptionProps: DOMAttributes<FocusableElement>;
  endAddon?: ReactNode;
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  errorMessageProps: DOMAttributes<FocusableElement>;
  info?: string;
  isInvalid: boolean;
  label?: string | ReactNode;
  labelProps: DOMAttributes<FocusableElement>;
  isDisabled?: boolean;
  startVisual?: ReactNode;
  variant: InputVariants['variant'];
  size?: NonNullable<InputVariants['size']>;
  tag?: string;
  validationDetails: ValidityState;
  validationErrors: string[];
  inlineVisuals?: boolean;
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
      size = 'md',
      startVisual,
      tag,
      isDisabled = false,
      isInvalid,
      validationDetails,
      validationErrors,
      variant = 'default',
      inlineVisuals = false,
    }: IFieldProps,
    ref: ForwardedRef<ElementRef<'input' | 'textarea' | 'select' | 'button'>>,
  ) => {
    const isPositive = variant === 'positive';
    isInvalid = isInvalid || variant === 'negative';
    isDisabled = isDisabled || variant === 'readonly';

    const currentVariant = isInvalid
      ? 'negative'
      : isPositive
        ? 'positive'
        : variant;

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
            isDisabled={isDisabled}
            {...labelProps}
          />
        )}
        <div
          className={baseContainerClass({
            variant: currentVariant,
          })}
        >
          {startVisual && (
            <div
              className={classNames(
                startAddonSize[size],
                startAddonStyles[inlineVisuals ? 'inline' : 'fullHeight'],
              )}
              ref={(el) => {
                if (el && ref && 'current' in ref) {
                  ref.current?.style.setProperty(
                    '--start-addon-width',
                    `${el.offsetWidth}px`,
                  );
                }
              }}
            >
              {startVisual}
            </div>
          )}
          {children}
          {endAddon && (
            <div
              className={classNames(
                endAddonStyles[inlineVisuals ? 'inline' : 'fullHeight'],
              )}
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
            intent={variant === 'readonly' ? 'default' : variant}
          >
            {description}
          </FormFieldHelpText>
        )}
        {isInvalid && (
          <FormFieldHelpText {...errorMessageProps} intent="negative">
            {error || (errorMessage as string)}
          </FormFieldHelpText>
        )}
      </div>
    );
  },
);

Field.displayName = 'Field';

export { Field };
