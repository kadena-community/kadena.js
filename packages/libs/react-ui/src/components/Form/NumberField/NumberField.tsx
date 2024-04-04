import { MonoExpandLess, MonoExpandMore } from '@kadena/react-icons/system';
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
import type { AriaNumberFieldProps } from 'react-aria';
import { useFocusRing, useHover, useLocale, useNumberField } from 'react-aria';
import { useNumberFieldState } from 'react-stately';
import { bodyBaseRegular, monospaceBaseRegular } from '../../../styles';
import { Button } from '../../Button';
import { formField, input, inputContainer, startAddon } from '../Form.css';
import { FormFieldHeader } from '../FormFieldHeader/FormFieldHeader';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';
import {
  buttonClass,
  buttonContainerClass,
  iconClass,
} from './NumberField.css';

type PickedAriaNumberFieldProps = Omit<
  AriaNumberFieldProps,
  'children' | 'inputElementType' | 'onChange' | 'type'
>;
export interface INumberFieldProps extends PickedAriaNumberFieldProps {
  // block type
  className?: string;
  isPositive?: boolean;
  tag?: string;
  info?: string;
  /*
   * @deprecated Use `isDisabled` instead. only here to support libs that manages props like `react-hook-form`
   */
  disabled?: boolean;
  /*
   * using native onChange handler instead of AriaNumberFieldProps.onChange to support uncontrolled form state eg. react-hook-form
   */
  onChange?: ComponentProps<'input'>['onChange'];
  /*
   * alias for `AriaNumberFieldProps.onChange`
   */
  onValueChange?: (value: number) => void;
  startAddon?: ReactNode;

  isOutlined?: boolean;
  inputFont?: 'body' | 'code';
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, react/function-component-definition
export function NumberFieldBase(
  props: INumberFieldProps,
  forwardedRef: ForwardedRef<ElementRef<'input'>>,
) {
  const ref = useObjectRef<ElementRef<'input'>>(forwardedRef);
  const isDisabled = props.isDisabled || props.disabled;
  const { locale } = useLocale();
  const state = useNumberFieldState({
    ...props,
    onChange: props.onValueChange,
    locale,
  });

  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    incrementButtonProps,
    decrementButtonProps,
    ...validation
  } = useNumberField(
    {
      ...props,
      onChange: props.onValueChange,
      isDisabled,
    },
    state,
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
          data-outlined={props.isOutlined || undefined}
        />

        <div className={buttonContainerClass}>
          <Button
            icon={<MonoExpandLess size="sm" className={iconClass} />}
            variant="text"
            isCompact
            className={buttonClass}
            {...incrementButtonProps}
          />
          <Button
            icon={<MonoExpandMore className={iconClass} />}
            variant="text"
            isCompact
            className={buttonClass}
            {...decrementButtonProps}
          />
        </div>
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

export const NumberField = forwardRef(NumberFieldBase);
