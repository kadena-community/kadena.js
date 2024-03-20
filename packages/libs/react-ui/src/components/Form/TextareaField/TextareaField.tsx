import { mergeProps, useLayoutEffect, useObjectRef } from '@react-aria/utils';
import { useControlledState } from '@react-stately/utils';
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
import { formField, inputContainer } from '../Form.css';
import { FormFieldHeader } from '../FormFieldHeader/FormFieldHeader';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';
import { addon, textarea } from './TextareaField.css';

type PickedAriaTextFieldProps = Omit<
  AriaTextFieldProps,
  'children' | 'inputElementType' | 'onChange' | 'type' | 'pattern'
>;
export interface ITextareaFieldProps extends PickedAriaTextFieldProps {
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
  onChange?: ComponentProps<'textarea'>['onChange'];
  /*
   * alias for `AriaTextFieldProps.onChange`
   */
  onValueChange?: (value: string) => void;
  rows?: number;
  autoResize?: boolean;
  endAddon?: ReactNode;
  isOutlined?: boolean;
  inputFont?: 'body' | 'code';
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, react/function-component-definition
export function TextareaFieldBase(
  props: ITextareaFieldProps,
  forwardedRef: ForwardedRef<ElementRef<'textarea'>>,
) {
  const ref = useObjectRef<ElementRef<'textarea'>>(forwardedRef);
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
      inputElementType: 'textarea',
      isDisabled,
    },
    ref,
  );

  const { hoverProps, isHovered } = useHover(props);
  const { isFocused, isFocusVisible, focusProps } = useFocusRing({
    isTextInput: true,
    autoFocus: props.autoFocus,
  });

  // handle auto resize textarea
  const [inputValue, setInputValue] = useControlledState(
    props.value,
    props.defaultValue ?? '',
    () => {},
  );

  const onHeightChange = useCallback(() => {
    if (props.autoResize && ref.current) {
      const input = ref.current;
      const prevAlignment = input.style.alignSelf;
      const prevOverflow = input.style.overflow;
      const isFirefox = 'MozAppearance' in input.style;
      if (!isFirefox) {
        input.style.overflow = 'hidden';
      }
      input.style.alignSelf = 'start';
      input.style.height = 'auto';
      // offsetHeight - clientHeight accounts for the border/padding.
      input.style.height = `${
        input.scrollHeight + (input.offsetHeight - input.clientHeight)
      }px`;
      input.style.overflow = prevOverflow;
      input.style.alignSelf = prevAlignment;
    }
  }, [props.autoResize, ref, props.rows]);

  useLayoutEffect(() => {
    if (ref.current) {
      onHeightChange();
    }
  }, [onHeightChange, inputValue, ref]);

  // handle uncontrollable form state eg. react-hook-form
  const handleOnChange = useCallback(
    (event: ChangeEvent<ElementRef<'textarea'>>) => {
      inputProps.onChange?.(event);
      setInputValue(event.target.value);
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
        <textarea
          {...mergeProps(inputProps, focusProps, hoverProps)}
          rows={props.rows}
          onChange={handleOnChange}
          ref={ref}
          className={classNames(
            textarea,
            props.inputFont === 'code' ? monospaceBaseRegular : bodyBaseRegular,
          )}
          data-outlined={props.isOutlined || undefined}
          data-focused={isFocused || undefined}
          data-disabled={isDisabled || undefined}
          data-hovered={isHovered || undefined}
          data-focus-visible={isFocusVisible || undefined}
          data-invalid={validation.isInvalid || undefined}
          data-positive={props.isPositive || undefined}
        />
        {props.endAddon && (
          <div
            className={addon}
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

export const TextareaField = forwardRef(TextareaFieldBase);
