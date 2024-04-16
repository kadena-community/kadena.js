import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type {
  ChangeEvent,
  ComponentProps,
  ElementRef,
  ForwardedRef,
  ReactElement,
} from 'react';
import React, { forwardRef, useCallback } from 'react';
import type { AriaTextFieldProps } from 'react-aria';
import { useFocusRing, useHover, useTextField } from 'react-aria';
import type { IButtonProps } from '../../Button/Button';
import { Field } from '../Field/Field';
import { input } from '../Form.css';

type PickedAriaTextFieldProps = Omit<
  AriaTextFieldProps,
  'children' | 'inputElementType' | 'onChange'
>;

type Variants = NonNullable<RecipeVariants<typeof input>>;

// add readonly variant, check disabled state

export interface ITextFieldProps extends PickedAriaTextFieldProps {
  className?: string;
  tag?: string;
  info?: string;
  startVisual?: ReactElement;
  endAddon?: ReactElement;
  actionButton?: Omit<IButtonProps, 'variant'>;
  variant?: Variants['variant'];
  fontType?: Variants['fontType'];
  size?: Variants['size'];
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
}

export function TextFieldBase(
  {
    className,
    tag,
    info,
    startVisual,
    actionButton,
    fontType = 'ui',
    size = 'md',
    variant = 'default',
    endAddon,
    ...props
  }: ITextFieldProps,
  forwardedRef: ForwardedRef<ElementRef<'input'>>,
) {
  const ref = useObjectRef<ElementRef<'input'>>(forwardedRef);
  const isDisabled = props.isDisabled || props.disabled;
  const { inputProps, ...fieldProps } = useTextField(
    {
      ...props,
      onChange: props.onValueChange,
      inputElementType: 'input',
      isDisabled: isDisabled,
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

  return (
    <Field
      {...fieldProps}
      variant={variant}
      label={props.label}
      description={props.description}
      startAddon={startVisual}
      endAddon={endAddon}
      tag={tag}
      info={info}
      ref={ref}
    >
      <input
        {...mergeProps(inputProps, focusProps, hoverProps)}
        onChange={handleOnChange}
        ref={ref}
        className={input({
          variant,
          size,
          fontType,
        })}
        data-focused={isFocused || undefined}
        data-disabled={isDisabled || undefined}
        data-hovered={isHovered || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-invalid={fieldProps.isInvalid || undefined}
        data-has-start-addon={!!startVisual || undefined}
        data-has-end-addon={!!actionButton || undefined}
      />
    </Field>
  );
}

export const TextField = forwardRef(TextFieldBase);
