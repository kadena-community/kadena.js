import { useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { AriaButtonProps, AriaFocusRingProps } from 'react-aria';
import { mergeProps, useFocusRing, useHover, useLink } from 'react-aria';
import type { ILinkProps } from '.';
import { button } from '../Button/BaseButton/BaseButton.css';
import { disableLoadingProps } from '../Button/utils';

type Variants = NonNullable<RecipeVariants<typeof button>>;

export interface IBaseLinkProps
  extends Variants,
    AriaButtonProps<'link'>,
    Omit<AriaFocusRingProps, 'isTextInput'> {
  className?: string;
  isDisabled?: boolean;
  title?: string;
  style?: React.CSSProperties;
}

const BaseLink = forwardRef(
  (
    { children, isCompact = false, variant = 'primary', ...props }: ILinkProps,
    forwardedRef: ForwardedRef<HTMLAnchorElement>,
  ) => {
    props = disableLoadingProps(props);
    const ref = useObjectRef(forwardedRef);
    const { linkProps, isPressed } = useLink(props, ref);
    const { hoverProps, isHovered } = useHover(props);
    const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

    return (
      <a
        {...mergeProps(linkProps, hoverProps, focusProps)}
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
      </a>
    );
  },
);

BaseLink.displayName = 'BaseLink';

export { BaseLink };
