/* eslint-disable @kadena-dev/no-eslint-disable */

import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type {
  ComponentProps,
  ForwardedRef,
  MouseEvent,
  ReactNode,
} from 'react';
import React, { forwardRef, useCallback } from 'react';
import type { AriaButtonProps, HoverEvents } from 'react-aria';
import { useButton, useFocusRing, useHover } from 'react-aria';
import { Loading } from '../Icon/System/SystemIcon';
import { button, spinner } from './NewButton.css';

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
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  icon?: ReactNode;
  /**
   * @deprecated use `onPress` instead to be consistent with React Aria, also keep in mind that `onPress` is not a native event it is a synthetic event created by React Aria
   * @see https://react-spectrum.adobe.com/react-aria/useButton.html#props
   */
  onClick?: ComponentProps<'button'>['onClick'];
}
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/function-component-definition */

function BaseButton(
  props: IButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) {
  const ref = useObjectRef(forwardedRef);
  const { buttonProps, isPressed } = useButton(props, ref);
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

  // support for deprecated `onClick` prop
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(event);
      buttonProps.onClick?.(event);
    },
    [props.onClick, buttonProps.onClick],
  );

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

  return (
    <button
      {...mergeProps(buttonProps, hoverProps, focusProps)}
      ref={ref}
      className={button({
        onlyIcon,
        variant: props.variant,
        isCompact: props.isCompact,
        isOutlined: props.isOutlined,
      })}
      onClick={handleClick}
      data-disabled={props.isDisabled || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
    >
      {props.isLoading ? (
        <>
          <Loading className={spinner} />
          {onlyIcon ? null : 'Loading'}
        </>
      ) : (
        content
      )}
    </button>
  );
}

export const NewButton = forwardRef(BaseButton);
