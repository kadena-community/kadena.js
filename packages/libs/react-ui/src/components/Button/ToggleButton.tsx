import { mergeProps, useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { AriaToggleButtonProps } from 'react-aria';
import { useFocusRing, useHover, useToggleButton } from 'react-aria';
import { useToggleState } from 'react-stately';
import { ProgressCircle } from '../ProgressCircle';
import { button } from './BaseButton/BaseButton.css';
import { iconOnlyStyle } from './Button.css';
import type { ISharedButtonProps } from './utils';
import { disableLoadingProps } from './utils';

type PickedAriaToggleButtonProps = Omit<AriaToggleButtonProps, 'elementType'>;

export interface IToggleButtonProps
  extends PickedAriaToggleButtonProps,
    ISharedButtonProps {}

const ToggleButtonBase = (
  props: IToggleButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) => {
  props = disableLoadingProps(props);
  const ref = useObjectRef(forwardedRef);
  const state = useToggleState(props);
  const { buttonProps, isPressed } = useToggleButton(props, state, ref);
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

  const onlyIcon = props.icon !== undefined;
  const content = onlyIcon ? (
    <span className={iconOnlyStyle}>{props.icon}</span>
  ) : (
    <>
      {props.startIcon}
      {props.children}
      {props.endIcon}
    </>
  );

  const isLoadingAriaLiveLabel = `${
    typeof props.children === 'string'
      ? props.children
      : buttonProps['aria-label'] ?? 'is'
  } loading`.trim();

  return (
    <button
      {...mergeProps(buttonProps, hoverProps, focusProps)}
      ref={ref}
      className={classNames(
        button({
          variant: props.variant,
          isCompact: props.isCompact,
          isLoading: props.isLoading,
        }),
        props.className,
      )}
      style={props.style}
      title={props.title}
      aria-disabled={props.isLoading || undefined}
      data-disabled={props.isDisabled || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-selected={state.isSelected || undefined}
      data-focus-visible={isFocusVisible || undefined}
    >
      {props.isLoading ? (
        <>
          {onlyIcon ? null : 'Loading'}
          <ProgressCircle
            aria-hidden="true"
            aria-label={isLoadingAriaLiveLabel}
            isIndeterminate
          />
        </>
      ) : (
        content
      )}
    </button>
  );
};

export const ToggleButton = forwardRef(ToggleButtonBase);
