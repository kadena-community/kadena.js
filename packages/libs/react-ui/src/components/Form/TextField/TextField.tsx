import { mergeProps, useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type {
  ChangeEvent,
  ComponentProps,
  ElementRef,
  ForwardedRef,
  ReactNode,
} from 'react';
import React, { forwardRef, useCallback } from 'react';
import type { AriaTextFieldProps } from 'react-aria';
import { useFocusRing, useHover, useTextField } from 'react-aria';
import { bodyBaseRegular, monospaceBaseRegular } from '../../../styles';
import {
  endAddon,
  formField,
  input,
  inputContainer,
  startAddon,
} from '../Form.css';
import { FormFieldHeader } from '../FormFieldHeader/FormFieldHeader';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';

type PickedAriaTextFieldProps = Omit<
  AriaTextFieldProps,
  'children' | 'inputElementType' | 'onChange'
>;
export interface ITextFieldProps extends PickedAriaTextFieldProps {
  className?: string;
  isPositive?: boolean;
  tag?: string;
  info?: string;
  /*
   * @deprecated Use `isDisabled` instead. only here to support libs that manages props like `react-hook-form`
   */
  disabled?: boolean;
  /*
   * using native onChange handler instead of AriaTextFieldProps.onChange to support uncontrolled form state eg. react-hook-form
   */
  onChange?: ComponentProps<'input'>['onChange'];
  /*
   * alias for `AriaTextFieldProps.onChange`
   */
  onValueChange?: (value: string) => void;
  startAddon?: ReactNode;
  endAddon?: ReactNode;
  isOutlined?: boolean;
  inputFont?: 'body' | 'code';
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, react/function-component-definition
export function TextFieldBase(
  props: ITextFieldProps,
  forwardedRef: ForwardedRef<ElementRef<'input'>>,
) {
  const ref = useObjectRef<ElementRef<'input'>>(forwardedRef);
  const isDisabled = props.isDisabled || props.disabled;
  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useTextField(
    {
      ...props,
      onChange: props.onValueChange,
      inputElementType: 'input',
      isDisabled,
    },
    ref,
  );

  const { hoverProps, isHovered } = useHover(props);
  const { isFocused, isFocusVisible, focusProps } = useFocusRing({
    isTextInput: true,
    autoFocus: props.autoFocus,
  });

  // handle uncontrollable form state eg. react-hook-form
  const handleOnChange = useCallback(
    (event: ChangeEvent<ElementRef<'input'>>) => {
      inputProps.onChange?.(event);
      props.onChange?.(event);
    },
    [props.onChange, inputProps.onChange],
  );

  // aggregate error message from validation props
  const errorMessage =
    typeof props.errorMessage === 'function'
      ? props.errorMessage(validation)
      : props.errorMessage ?? validation.validationErrors.join(' ');

  return (
    <div className={classNames(formField, props.className)}>
      {props.label && (
        <FormFieldHeader
          label={props.label}
          tag={props.tag}
          info={props.info}
          {...labelProps}
        />
      )}
      <div className={inputContainer}>
        {props.startAddon && (
          <div
            className={startAddon}
            ref={(el) => {
              if (el) {
                ref.current?.style.setProperty(
                  '--start-addon-width',
                  `${el.offsetWidth}px`,
                );
              }
            }}
          >
            {props.startAddon}
          </div>
        )}

        <input
          {...mergeProps(inputProps, focusProps, hoverProps)}
          onChange={handleOnChange}
          ref={ref}
          className={classNames(
            input,
            props.inputFont === 'code' ? monospaceBaseRegular : bodyBaseRegular,
          )}
          data-focused={isFocused || undefined}
          data-disabled={isDisabled || undefined}
          data-hovered={isHovered || undefined}
          data-focus-visible={isFocusVisible || undefined}
          data-invalid={validation.isInvalid || undefined}
          data-positive={props.isPositive || undefined}
          data-has-start-addon={!!props.startAddon || undefined}
          data-has-end-addon={!!props.endAddon || undefined}
          data-outlined={props.isOutlined || undefined}
        />

        {props.endAddon && (
          <div
            className={endAddon}
            ref={(el) => {
              if (el) {
                ref.current?.style.setProperty(
                  '--end-addon-width',
                  `${el.offsetWidth}px`,
                );
              }
            }}
          >
            {props.endAddon}
          </div>
        )}
      </div>
      {props.description && !validation.isInvalid && (
        <FormFieldHelpText
          {...descriptionProps}
          intent={props.isPositive ? 'positive' : 'info'}
        >
          {props.description}
        </FormFieldHelpText>
      )}
      {validation.isInvalid && (
        <FormFieldHelpText {...errorMessageProps} intent="negative">
          {errorMessage}
        </FormFieldHelpText>
      )}
    </div>
  );
}

export const TextField = forwardRef(TextFieldBase);
