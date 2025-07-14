import React, { useRef } from 'react';
import type { AriaToggleButtonProps } from 'react-aria';
import { mergeProps, useHover, useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import { toggleButtonClass } from './style.css';

export interface IToggleButtonProps extends AriaToggleButtonProps {
  children: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  isReadOnly?: boolean;
  isDeterminate?: boolean;
  inverse?: boolean;
  onChange?: (isSelected: boolean) => void;
}

export function ToggleButton(props: IToggleButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { isHovered, hoverProps } = useHover(props);
  const state = useToggleState(props);
  const { buttonProps, isPressed } = useToggleButton(props, state, ref);

  return (
    <button
      {...mergeProps(hoverProps, buttonProps)}
      data-hovered={isHovered}
      className={toggleButtonClass({ isPressed, isSelected: state.isSelected })}
      ref={ref}
    >
      {props.children}
    </button>
  );
}
