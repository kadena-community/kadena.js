import { useObjectRef } from '@react-aria/utils';
import type { ForwardedRef, ReactElement } from 'react';
import React, { forwardRef } from 'react';
import type { AriaSelectProps } from 'react-aria';
import { HiddenSelect, useSelect } from 'react-aria';
import { useSelectState } from 'react-stately';

import { ListBox } from '../../ListBox';
import { Popover } from '../../Popover';

import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import { Field } from '../Field/Field';
import { input } from '../Form.css';
import { selectButtonValue, selectItemClass } from './Select.css';
import { SelectButton } from './SelectButton';

type Variants = NonNullable<RecipeVariants<typeof input>>;

export interface ISelectProps<T extends object = any>
  extends AriaSelectProps<T> {
  variant?: Variants['variant'];
  fontType?: Variants['fontType'];
  size?: Variants['size'];
  /*
   * @deprecated Use `isDisabled` instead. only here to support libs that manages props like `react-hook-form`
   */
  disabled?: boolean;
  isPositive?: boolean;
  tag?: string;
  info?: string;
  startVisual?: ReactElement;
  className?: string;
}

function SelectBase<T extends object>(
  props: ISelectProps<T>,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) {
  const {
    size = 'md',
    fontType = 'ui',
    className,
    tag,
    info,
    errorMessage,
    description,
    variant = 'default',
    label,
    startVisual,
  } = props;
  const isDisabled = props.disabled ?? props.isDisabled;
  const ref = useObjectRef(forwardedRef);

  const state = useSelectState({
    ...props,
    isDisabled,
  });

  const { triggerProps, valueProps, menuProps, ...fieldProps } = useSelect(
    {
      ...props,
      isDisabled,
    },
    state,
    ref,
  );

  return (
    <Field
      {...fieldProps}
      variant={variant}
      label={label}
      isDisabled={isDisabled}
      description={description}
      errorMessage={errorMessage}
      size={size}
      tag={tag}
      info={info}
      ref={ref}
      startVisual={startVisual}
      isInvalid={fieldProps.isInvalid}
    >
      <HiddenSelect
        isDisabled={isDisabled}
        state={state}
        triggerRef={ref}
        label={label}
        name={props.name}
      />
      <SelectButton
        {...triggerProps}
        className={classNames(
          input({
            size,
            variant,
            fontType,
          }),
          className,
        )}
        size={size}
        ref={ref}
        state={state}
        isDisabled={isDisabled}
        data-disabled={isDisabled || undefined}
        data-has-end-addon
        data-has-start-addon={!!startVisual || undefined}
        autoFocus={props.autoFocus}
        isInvalid={fieldProps.isInvalid}
        isPositive={props.isPositive}
        elementType="button"
      >
        <span
          {...valueProps}
          data-placeholder={!state.selectedItem}
          className={selectButtonValue}
        >
          {state.selectedItem
            ? state.selectedItem.rendered
            : props.placeholder || 'Select an option'}
        </span>
      </SelectButton>
      {state.isOpen && (
        <Popover
          state={state}
          offset={1}
          triggerRef={ref}
          showArrow={false}
          placement="bottom start"
        >
          <ListBox
            {...menuProps}
            itemClassName={selectItemClass({ size, fontType })}
            state={state}
          />
        </Popover>
      )}
    </Field>
  );
}

export const Select = forwardRef(SelectBase) as <T extends object>(
  props: ISelectProps<T> & { ref?: ForwardedRef<HTMLButtonElement> },
) => JSX.Element;

export { Item as SelectItem } from 'react-stately';
