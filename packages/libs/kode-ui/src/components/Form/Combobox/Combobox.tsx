import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { ForwardedRef, ReactNode } from 'react';
import React, { forwardRef, useRef } from 'react';
import type { AriaComboBoxProps } from 'react-aria';
import { useComboBox, useFilter, useHover } from 'react-aria';
import { useComboBoxState } from 'react-stately';

import { MonoExpandMore } from '@kadena/kode-icons';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import { rotate180Transition } from '../../../styles';
import { Button } from '../../Button';
import { ListBox } from '../../ListBox';
import { Popover } from '../../Popover';
import { Field } from '../Field/Field';
import { input } from '../Form.css';
import type { FormFieldDirection } from '../FormFieldHeader/FormFieldHeader';
import { comboBoxControlClass } from './Combobox.css';

type Variants = NonNullable<RecipeVariants<typeof input>>;

export interface IComboboxProps<T extends object = any>
  extends AriaComboBoxProps<T> {
  variant?: Variants['variant'];
  fontType?: Variants['fontType'];
  size?: Variants['size'];
  isPositive?: boolean;
  startVisual?: ReactNode;
  className?: string;
  tag?: string;
  info?: string;
  direction?: FormFieldDirection;
  allowsCustomValue?: boolean;
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
  const isDisabled = props.disabled ?? props.isDisabled;
  const inputRef = useObjectRef(ref);
  const buttonRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);

  const {
    size = 'md',
    fontType = 'ui',
    className,
    tag,
    info,
    errorMessage,
    description,
    variant = 'default',
    startVisual,
    label,
    direction = 'row',
  } = props;

  const { contains } = useFilter({ sensitivity: 'base' });
  const state = useComboBoxState({
    shouldCloseOnBlur: true,
    ...props,
    isDisabled,
    defaultFilter: props.defaultFilter || contains,
  });

  const { buttonProps, inputProps, listBoxProps, ...fieldProps } = useComboBox(
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

  return (
    <Field
      {...fieldProps}
      variant={variant}
      label={label}
      isDisabled={isDisabled}
      description={description}
      direction={direction}
      errorMessage={errorMessage}
      size={size}
      tag={tag}
      info={info}
      ref={inputRef}
      isInvalid={fieldProps.isInvalid}
      startVisual={startVisual}
      endAddon={
        <Button variant="transparent" {...buttonProps} ref={buttonRef}>
          <MonoExpandMore
            data-open={state.isOpen}
            className={rotate180Transition}
          />
        </Button>
      }
    >
      <div
        {...mergeProps(dataProps, hoverProps)}
        ref={triggerRef}
        className={comboBoxControlClass}
      >
        <input
          {...inputProps}
          ref={inputRef}
          className={classNames(input({ fontType, variant, size }), className)}
          data-has-start-addon={!!startVisual || undefined}
          data-has-end-addon
        />
      </div>
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
    </Field>
  );
}

export const Combobox = forwardRef(ComboBoxBase) as <T extends object>(
  props: IComboboxProps<T> & { ref?: ForwardedRef<HTMLInputElement> },
) => JSX.Element;

export { Item as ComboboxItem } from 'react-stately';
