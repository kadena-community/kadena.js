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
import React, { forwardRef, useCallback, useState } from 'react';
import type { AriaTextFieldProps } from 'react-aria';
import { useFocusRing, useHover, useTextField } from 'react-aria';
import { useMobile } from '../../../utils';
import { Field } from '../Field/Field';
import type { InputVariants } from '../Form.css';
import { input } from '../Form.css';
import { textarea } from './TextareaField.css';

type PickedAriaTextFieldProps = Omit<
  AriaTextFieldProps,
  'children' | 'inputElementType' | 'onChange' | 'type' | 'pattern'
>;
export interface ITextareaFieldProps extends PickedAriaTextFieldProps {
  variant?: InputVariants['variant'];
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
  startVisual?: ReactNode;
  endAddon?: ReactNode;
  isOutlined?: boolean;
  fontType?: 'ui' | 'code';
  size?: 'sm' | 'md' | 'lg';
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, react/function-component-definition
export function TextareaFieldBase(
  props: ITextareaFieldProps,
  forwardedRef: ForwardedRef<ElementRef<'textarea'>>,
) {
  const {
    size = 'md',
    fontType = 'ui',
    className,
    tag,
    startVisual,
    info,
    errorMessage,
    endAddon,
    description,
    variant = 'default',
    label,
  } = props;
  const ref = useObjectRef<ElementRef<'textarea'>>(forwardedRef);
  const isDisabled = props.isDisabled || props.disabled;
  const { inputProps, ...fieldProps } = useTextField(
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

  const [isTouched, setIsTouched] = useState(false);
  const { isMobile } = useMobile();

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
      setIsTouched(isTouched && !!event.target.value);
    },
    [props.onChange, inputProps.onChange],
  );

  return (
    <Field
      {...fieldProps}
      startVisual={startVisual}
      variant={variant}
      label={label}
      isDisabled={isDisabled}
      description={description}
      endAddon={endAddon}
      errorMessage={errorMessage}
      size={size}
      tag={tag}
      info={info}
      ref={ref}
      inlineVisuals
    >
      <textarea
        {...mergeProps(inputProps, focusProps, hoverProps)}
        rows={props.rows}
        onChange={handleOnChange}
        ref={ref}
        className={classNames(
          input({
            variant: fieldProps.isInvalid && isTouched ? 'negative' : variant,
            size,
            fontType,
          }),
          textarea[size],
          className,
        )}
        data-outlined={props.isOutlined || undefined}
        data-focused={isFocused || undefined}
        data-disabled={isDisabled || undefined}
        data-hovered={isHovered || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-has-start-addon={!!startVisual || undefined}
        data-has-end-addon={!!endAddon || undefined}
        data-is-mobile={isMobile || undefined}
      />
    </Field>
  );
}

export const TextareaField = forwardRef(TextareaFieldBase);
