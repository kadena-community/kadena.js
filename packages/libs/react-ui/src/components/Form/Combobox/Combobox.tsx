import { mergeProps, useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type { ForwardedRef, ReactNode } from 'react';
import React, { forwardRef, useRef } from 'react';
import type { AriaComboBoxProps } from 'react-aria';
import { useComboBox, useFilter, useHover } from 'react-aria';
import { useComboBoxState } from 'react-stately';

import { atoms } from '../../../styles';
import { fixAriaLabeling } from '../../../utils';
import { ListBox } from '../../ListBox';
import { Popover } from '../../Popover';
import { formField } from '../Form.css';
import { FormFieldHeader } from '../FormFieldHeader/FormFieldHeader';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';
import { comboBoxControlClass, comboBoxInputClass } from './Combobox.css';
import { ComboboxButton } from './ComboboxButton';

export interface IComboboxProps<T extends object = any>
  extends AriaComboBoxProps<T> {
  isPositive?: boolean;
  startIcon?: ReactNode;
  className?: string;
  tag?: string;
  info?: string;
  /*
   * @deprecated Use `isDisabled` instead. only here to support libs that manages props like `react-hook-form`
   */
  disabled?: boolean;
  /** The filter function used to determine if a option should be included in the combo box list. */
  defaultFilter?: (textValue: string, inputValue: string) => boolean;
}

function ComboBoxBase<T extends object>(
  props: IComboboxProps<T>,
  ref: ForwardedRef<HTMLInputElement>,
) {
  props = fixAriaLabeling(props, 'ComboBox');
  const isDisabled = props.disabled ?? props.isDisabled;
  const inputRef = useObjectRef(ref);
  const buttonRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  const { contains } = useFilter({ sensitivity: 'base' });
  const state = useComboBoxState({
    shouldCloseOnBlur: true,
    ...props,
    isDisabled,
    defaultFilter: props.defaultFilter || contains,
  });

  const {
    buttonProps,
    inputProps,
    listBoxProps,
    labelProps,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useComboBox(
    {
      ...props,
      isDisabled,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state,
  );
  const { isHovered, hoverProps } = useHover({
    isDisabled: isDisabled,
  });

  const dataProps = {
    'data-focused': state.isFocused || undefined,
    'data-disabled': isDisabled || undefined,
    'data-hovered': isHovered || undefined,
    'data-invalid': props.isInvalid || undefined,
    'data-positive': props.isPositive || undefined,
  };
  // aggregate error message from validation props
  const errorMessage =
    typeof props.errorMessage === 'function'
      ? props.errorMessage(validation)
      : props.errorMessage ?? validation.validationErrors.join(' ');

  return (
    <div className={classNames(formField, props.className)}>
      {props.label && (
        <FormFieldHeader
          {...labelProps}
          label={props.label}
          info={props.info}
          tag={props.tag}
        />
      )}
      <div
        {...mergeProps(dataProps, hoverProps)}
        ref={triggerRef}
        className={comboBoxControlClass}
      >
        {props.startIcon && (
          <span className={atoms({ marginInlineEnd: 'sm' })}>
            {props.startIcon}
          </span>
        )}
        <input {...inputProps} ref={inputRef} className={comboBoxInputClass} />
        <ComboboxButton
          {...buttonProps}
          ref={buttonRef}
          state={state}
          isDisabled={isDisabled}
          autoFocus={props.autoFocus}
          isInvalid={validation.isInvalid}
          isPositive={props.isPositive}
          elementType="button"
        />
      </div>
      {props.description && (
        <FormFieldHelpText
          {...descriptionProps}
          data-disabled={isDisabled || undefined}
        >
          {props.description}
        </FormFieldHelpText>
      )}
      {validation.isInvalid && props.errorMessage && (
        <FormFieldHelpText {...errorMessageProps} intent="negative">
          {errorMessage}
        </FormFieldHelpText>
      )}
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={triggerRef}
          ref={popoverRef}
          isNonModal
          showArrow={false}
          placement="bottom start"
        >
          <ListBox {...listBoxProps} ref={listBoxRef} state={state} />
        </Popover>
      )}
    </div>
  );
}

export const Combobox = forwardRef(ComboBoxBase) as <T extends object>(
  props: IComboboxProps<T> & { ref?: ForwardedRef<HTMLInputElement> },
) => JSX.Element;

export { Item as ComboboxItem } from 'react-stately';
