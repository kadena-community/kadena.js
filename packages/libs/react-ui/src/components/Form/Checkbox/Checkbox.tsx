import { MonoCheck, MonoRemove } from '@kadena/react-icons';
import React, { useRef } from 'react';
import type { AriaCheckboxProps } from 'react-aria';
import {
  VisuallyHidden,
  mergeProps,
  useCheckbox,
  useFocusRing,
  useHover,
} from 'react-aria';
import { useToggleState } from 'react-stately';
import { boxClass, iconClass, labelClass } from './Checkbox.css';

export interface ICheckboxProps extends AriaCheckboxProps {
  children: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  isReadOnly?: boolean;
  isDeterminate?: boolean;
  inverse?: boolean;
  onChange?: (isSelected: boolean) => void;
}

export function Checkbox(props: ICheckboxProps) {
  const state = useToggleState(props);
  const ref = useRef(null);
  const { inputProps, labelProps } = useCheckbox(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover(props);

  const { isDisabled, children, isDeterminate, isReadOnly } = props;

  const hovered = isHovered && !isDisabled && !isReadOnly;

  return (
    <label
      {...mergeProps(labelProps, hoverProps, focusProps)}
      className={labelClass}
      data-hovered={hovered}
      data-disabled={isDisabled}
      data-focus-visible={isFocusVisible}
      data-readonly={isReadOnly}
      data-inversed={props.inverse}
    >
      <VisuallyHidden>
        <input {...mergeProps(inputProps, focusProps)} ref={ref} />
      </VisuallyHidden>
      <span className={boxClass} data-selected={state.isSelected} aria-hidden>
        {isDeterminate ? (
          <MonoRemove className={iconClass} />
        ) : (
          <MonoCheck className={iconClass} />
        )}
      </span>
      {children}
    </label>
  );
}
