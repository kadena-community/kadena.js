/* eslint-disable @kadena-dev/no-eslint-disable */

import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type { ComponentProps, ForwardedRef, ReactNode } from 'react';
import React, { forwardRef } from 'react';
import type { AriaButtonProps, HoverEvents } from 'react-aria';
import { useButton, useFocusRing, useHover } from 'react-aria';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';
import { button } from './NewButton.css';

type Variants = Omit<NonNullable<RecipeVariants<typeof button>>, 'onlyIcon'>;
// omit link related props from `AriaButtonProps`
type PickedAriaButtonProps = Omit<
  AriaButtonProps,
  'href' | 'target' | 'rel' | 'elementType'
>;

export interface IButtonProps
  extends PickedAriaButtonProps,
    HoverEvents,
    Variants {
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  icon?: ReactNode;
  /**
   * @deprecated use `onPress` instead to be consistent with React Aria, also keep in mind that `onPress` is not a native event it is a synthetic event created by React Aria
   * @see https://react-spectrum.adobe.com/react-aria/useButton.html#props
   */
  onClick?: ComponentProps<'button'>['onClick'];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function disableLoadingProps(props: IButtonProps) {
  const newProps = { ...props };
  // Don't allow interaction while isPending is true
  if (newProps.isLoading) {
    newProps.onPress = undefined;
    newProps.onPressStart = undefined;
    newProps.onPressEnd = undefined;
    newProps.onPressChange = undefined;
    newProps.onPressUp = undefined;
    newProps.onKeyDown = undefined;
    newProps.onKeyUp = undefined;
    newProps.onClick = undefined;
  }
  return newProps;
}

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/function-component-definition */
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
          onlyIcon,
          variant: props.variant,
          isCompact: props.isCompact,
          isOutlined: props.isOutlined,
          isLoading: props.isLoading,
        }),
        props.className,
      )}
      aria-disabled={props.isLoading || undefined}
      data-disabled={props.isDisabled || props.isLoading || undefined}
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
