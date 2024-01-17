import { mergeProps, useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { AriaButtonProps } from 'react-aria';
import { useButton, useFocusRing, useHover } from 'react-aria';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';
import { button } from './SharedButton.css';
import type { ISharedButtonProps } from './utils';
import { disableLoadingProps } from './utils';

// omit link related props from `AriaButtonProps`
type PickedAriaButtonProps = Omit<
  AriaButtonProps,
  'href' | 'target' | 'rel' | 'elementType'
>;

export interface IButtonProps
  extends PickedAriaButtonProps,
    ISharedButtonProps {}

function BaseButton(
  props: IButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) {
  props = disableLoadingProps(props);
  const ref = useObjectRef(forwardedRef);
  const { buttonProps, isPressed } = useButton(props, ref);
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

  const onlyIcon = props.icon !== undefined;
  const content = onlyIcon ? (
    props.icon
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
          color: props.color,
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
}

export const Button = forwardRef(BaseButton);
