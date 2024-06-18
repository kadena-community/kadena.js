import React, { useContext, useRef } from 'react';
import type { AriaRadioProps } from 'react-aria';
import {
  VisuallyHidden,
  mergeProps,
  useFocusRing,
  useHover,
  useRadio,
} from 'react-aria';
import type { RadioGroupState } from 'react-stately';
import { boxClass, iconClass, labelClass } from './Radio.css';
import { RadioContext } from './RadioGroup';

export interface IRadioProps extends AriaRadioProps {
  children: string;
  isSelected?: boolean;
  isReadOnly?: boolean;
  inverse?: boolean;
}

export function Radio(props: IRadioProps) {
  const { children, isReadOnly } = props;
  const state = (useContext(RadioContext) as RadioGroupState) || {};
  const ref = useRef(null);
  const { inputProps, isSelected, labelProps, isDisabled } = useRadio(
    props,
    state,
    ref,
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover(props);
  const hovered = isHovered && !isDisabled && !isReadOnly;

  const Dot = ({ className }: { className: string }) => (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="4" cy="4" r="4" />
    </svg>
  );

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
        <input {...inputProps} {...focusProps} ref={ref} />
      </VisuallyHidden>
      <span className={boxClass} data-selected={isSelected} aria-hidden>
        <Dot className={iconClass} />
      </span>
      {children}
    </label>
  );
}
