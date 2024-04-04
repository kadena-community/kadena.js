import { useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { AriaButtonProps, AriaFocusRingProps } from 'react-aria';
import { mergeProps, useButton, useFocusRing, useHover } from 'react-aria';
import { disableLoadingProps } from '../utils';
import { button } from './BaseButton.css';

type Variants = NonNullable<RecipeVariants<typeof button>>;

export interface IBaseButtonProps
  extends Variants,
    AriaButtonProps<'button'>,
    Omit<AriaFocusRingProps, 'isTextInput'> {
  className?: string;
  isDisabled?: boolean;
  title?: string;
  style?: React.CSSProperties;
}

const BaseButton = forwardRef(
  (
    {
      children,
      isCompact = false,
      variant = 'primary',
      ...props
    }: IBaseButtonProps,
    forwardedRef: ForwardedRef<HTMLButtonElement>,
  ) => {
    props = disableLoadingProps(props);
    const ref = useObjectRef(forwardedRef);
    const { buttonProps, isPressed } = useButton(props, ref);
    const { hoverProps, isHovered } = useHover(props);
    const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

    return (
      <button
        {...mergeProps(buttonProps, hoverProps, focusProps)}
        className={classNames(
          button({
            variant,
            isCompact,
            isLoading: props.isLoading,
          }),
          props.className,
        )}
        style={props.style}
        title={props.title}
        aria-disabled={props.isLoading || undefined}
        data-disabled={props.isDisabled || undefined}
        data-pressed={isPressed || undefined}
        data-hovered={(!isPressed && isHovered) || undefined}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        ref={ref}
      >
        {children}
      </button>
    );
  },
);

BaseButton.displayName = 'BaseButton';

export { BaseButton };
