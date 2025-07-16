import { MonoCheck } from '@kadena/kode-icons/system';
import type { ReactElement } from 'react';
import React, { useRef } from 'react';
import type { AriaToggleButtonProps } from 'react-aria';
import { mergeProps, useHover, useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import { toggleButtonClass } from './style.css';

export interface ISwitchButtonProps extends AriaToggleButtonProps {
  isDisabled?: boolean;
  isSelected?: boolean;
  size?: 'base' | 'small';
  onChange?: (isSelected: boolean) => void;
  onVisual?: ReactElement;
  offVisual?: ReactElement;
}

export function SwitchButton(props: ISwitchButtonProps) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { isHovered, hoverProps } = useHover(props);
  const state = useToggleState(props);
  const { buttonProps } = useToggleButton(props, state, ref);

  return (
    <button
      {...mergeProps(hoverProps, buttonProps)}
      data-hovered={isHovered}
      className={toggleButtonClass({
        isSelected: state.isSelected,
        isDisabled: props.isDisabled,
      })}
      ref={ref}
    >
      <span>{props.onVisual ? props.onVisual : <MonoCheck />}</span>
      <span>{props.offVisual ? props.offVisual : null}</span>
    </button>
  );
}
