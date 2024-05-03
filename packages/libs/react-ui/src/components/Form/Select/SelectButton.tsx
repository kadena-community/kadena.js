import { MonoExpandMore } from '@kadena/react-icons/system';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type { ForwardedRef, ReactNode, Ref } from 'react';
import React, { forwardRef } from 'react';
import type { AriaButtonProps } from 'react-aria';
import { useButton, useHover } from 'react-aria';
import type { SelectState } from 'react-stately';
import { atoms, rotate180Transition } from '../../../styles';
import {
  selectButtonClass,
  selectIconClass,
  selectIconWrapper,
} from './Select.css';

export interface ISelectButtonProps<T extends object> extends AriaButtonProps {
  state: SelectState<T>;
  children: ReactNode;
  className?: string;
  isInvalid?: boolean;
  isPositive?: boolean;
  startIcon?: ReactNode;
  size: 'sm' | 'md' | 'lg';
}
function SelectButtonBase<T extends object>(
  props: ISelectButtonProps<T>,
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
      data-role="select-button"
      className={classNames(selectButtonClass, props.className)}
      ref={ref}
    >
      {props.startIcon && (
        <span className={atoms({ marginInlineEnd: 'sm' })}>
          {props.startIcon}
        </span>
      )}
      {props.children}
      <span className={selectIconWrapper}>
        <MonoExpandMore
          data-open={props.state.isOpen}
          className={classNames(
            rotate180Transition,
            selectIconClass[props.size],
          )}
        />
      </span>
    </button>
  );
}

export const SelectButton = forwardRef(SelectButtonBase) as <T extends object>(
  props: ISelectButtonProps<T> & { ref?: Ref<HTMLButtonElement> },
) => JSX.Element;
