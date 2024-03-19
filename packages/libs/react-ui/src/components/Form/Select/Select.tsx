import { useObjectRef } from '@react-aria/utils';
import type { ForwardedRef, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import type { AriaSelectProps } from 'react-aria';
import { HiddenSelect, useSelect } from 'react-aria';
import { useSelectState } from 'react-stately';

import { ListBox } from '../../ListBox';
import { Popover } from '../../Popover';

import classNames from 'classnames';
import { fixAriaLabeling } from '../../../utils';
import { formField } from '../Form.css';
import { FormFieldHeader } from '../FormFieldHeader/FormFieldHeader';
import { FormFieldHelpText } from '../FormFieldHelpText/FormFieldHelpText';
import { selectValueClass } from './Select.css';
import { SelectButton } from './SelectButton';

export interface ISelectProps<T extends object = any>
  extends AriaSelectProps<T> {
  className?: string;
  isPositive?: boolean;
  startIcon?: ReactNode;
  tag?: string;
  info?: string;
  /*
   * @deprecated Use `isDisabled` instead. only here to support libs that manages props like `react-hook-form`
   */
  disabled?: boolean;
}
function SelectBase<T extends object>(
  props: ISelectProps<T>,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) {
  props = fixAriaLabeling(props, 'Select');
  const isDisabled = props.disabled ?? props.isDisabled;
  const ref = useObjectRef(forwardedRef);
  const state = useSelectState({
    ...props,
    isDisabled,
  });
  const {
    labelProps,
    triggerProps,
    valueProps,
    menuProps,
    descriptionProps,
    errorMessageProps,
    ...validation
  } = useSelect(
    {
      ...props,
      isDisabled,
    },
    state,
    ref,
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
          {...labelProps}
          label={props.label}
          info={props.info}
          tag={props.tag}
        />
      )}
      <HiddenSelect
        isDisabled={isDisabled}
        state={state}
        triggerRef={ref}
        label={props.label}
        name={props.name}
      />
      <SelectButton
        {...triggerProps}
        ref={ref}
        state={state}
        isDisabled={isDisabled}
        autoFocus={props.autoFocus}
        isInvalid={validation.isInvalid}
        isPositive={props.isPositive}
        startIcon={props.startIcon}
        elementType="button"
      >
        <span
          {...valueProps}
          className={selectValueClass}
          data-placeholder={!state.selectedItem}
        >
          {state.selectedItem
            ? state.selectedItem.rendered
            : props.placeholder || 'Select an option'}
        </span>
      </SelectButton>
      {props.description && !validation.isInvalid && (
        <FormFieldHelpText
          {...descriptionProps}
          intent={props.isPositive ? 'positive' : 'info'}
          data-disabled={isDisabled || undefined}
        >
          {props.description}
        </FormFieldHelpText>
      )}
      {validation.isInvalid && (
        <FormFieldHelpText {...errorMessageProps} intent="negative">
          {errorMessage}
        </FormFieldHelpText>
      )}
      {state.isOpen && (
        <Popover
          state={state}
          triggerRef={ref}
          showArrow={false}
          placement="bottom start"
        >
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </div>
  );
}

export const Select = forwardRef(SelectBase) as <T extends object>(
  props: ISelectProps<T> & { ref?: ForwardedRef<HTMLButtonElement> },
) => JSX.Element;

export { Item as SelectItem } from 'react-stately';
