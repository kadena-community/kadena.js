import { MonoExpandMore } from '@kadena/react-icons/system';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type { ForwardedRef, Ref } from 'react';
import React, { forwardRef } from 'react';
import type { AriaButtonProps } from 'react-aria';
import { useButton, useHover } from 'react-aria';
import type { ComboBoxState } from 'react-stately';
import { rotate180Transition } from '../../../styles';

export interface IComboboxButtonProps<T extends object>
  extends AriaButtonProps {
  isPositive?: boolean;
  state: ComboBoxState<T>;
  className?: string;
  isInvalid?: boolean;
}
function ComboboxButtonBase<T extends object>(
  props: IComboboxButtonProps<T>,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) {
  const ref = useObjectRef(forwardedRef);
  const { buttonProps } = useButton(props, ref);
  const { isHovered, hoverProps } = useHover({
    isDisabled: props.isDisabled,
  });

  const dataProps = {
    'data-focused': props.state.isFocused || undefined,
    'data-disabled': props.isDisabled || undefined,
    'data-hovered': isHovered || undefined,
    'data-invalid': props.isInvalid || undefined,
    'data-positive': props.isPositive || undefined,
  };

  return (
    <button
      {...mergeProps(buttonProps, dataProps, hoverProps)}
      className={classNames(props.className)}
      ref={ref}
    >
      <MonoExpandMore
        data-open={props.state.isOpen}
        className={rotate180Transition}
      />
    </button>
  );
}

export const ComboboxButton = forwardRef(ComboboxButtonBase) as <
  T extends object,
>(
  props: IComboboxButtonProps<T> & { ref?: Ref<HTMLButtonElement> },
) => JSX.Element;
