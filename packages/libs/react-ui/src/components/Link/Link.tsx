import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type { ForwardedRef, ReactElement } from 'react';
import React, { forwardRef } from 'react';
import type { AriaButtonProps, AriaFocusRingProps } from 'react-aria';
import { useFocusRing, useHover, useLink } from 'react-aria';
import {
  button,
  centerContentWrapper,
  directionStyle,
  endVisualStyle,
  iconOnlyStyle,
  noEndVisualStyle,
  noStartVisualStyle,
  startVisualStyle,
} from '../Button/Button.css';
import { disableLoadingProps } from '../Button/utils';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';

type Variants = NonNullable<RecipeVariants<typeof button>>;

export type ILinkProps = Omit<AriaFocusRingProps, 'isTextInput'> &
  Variants &
  Omit<AriaFocusRingProps, 'isTextInput'> &
  Pick<AriaButtonProps<'button'>, 'aria-label' | 'href' | 'type' | 'target'> & {
    className?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    title?: string;
    style?: React.CSSProperties;
    loadingLabel?: string;
    children?: string | ReactElement;
    startVisual?: ReactElement;
    endVisual?: ReactElement;
  };

/**
 * Button component
 * @param variant - button style variant
 * @param startVisual - visual to render at the beginning of the button
 * @param endVisual - visual to render at the end of the button
 * @param children - label to be shown
 * @param isDisabled - disabled state
 * @param isLoading - loading state
 * @param isCompact - compact button style
 * @param loadingLabel - label to be shown when loading
 * @param className - additional class name
 * @param style - additional style
 * @param title - title to be shown as HTML tooltip
 */

const Link = forwardRef(
  (
    {
      startVisual,
      endVisual,
      children,
      isCompact = false,
      loadingLabel = 'Loading',
      variant = 'primary',
      className,
      ...props
    }: ILinkProps,
    forwardedRef: ForwardedRef<HTMLAnchorElement>,
  ) => {
    props = disableLoadingProps(props);
    loadingLabel = loadingLabel.trim();
    const ref = useObjectRef(forwardedRef);
    const { linkProps, isPressed } = useLink(props, ref);
    const { hoverProps, isHovered } = useHover(props);
    const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

    const iconOnly = Boolean(
      // check if children is a ReactElement
      (typeof children !== 'string' && typeof children !== 'number') ||
        // check if no visuals are provided
        (!startVisual && !endVisual && !children) ||
        // check if only one visual is provided
        (!children &&
          ((startVisual && !endVisual) || (endVisual && !startVisual))) ||
        // check if there is a loading label while loading
        (!loadingLabel && props.isLoading),
    );

    const isLoadingAriaLiveLabel = `${
      typeof children === 'string' ? children : props['aria-label'] ?? 'is'
    } loading`.trim();

    return (
      <a
        {...mergeProps(linkProps, hoverProps, focusProps)}
        className={classNames(
          button({
            variant,
            isCompact,
            isLoading: props.isLoading,
          }),
          className,
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
        <span
          className={classNames({
            [centerContentWrapper]: !iconOnly,
            [iconOnlyStyle]: iconOnly,
            [noEndVisualStyle]: !endVisual && !iconOnly,
            [noStartVisualStyle]: !startVisual && !iconOnly,
            [startVisualStyle]: startVisual && !iconOnly,
            [endVisualStyle]: endVisual && !iconOnly,
            [directionStyle]: props.isLoading && startVisual && !endVisual,
          })}
        >
          {props.isLoading ? (
            <>
              {iconOnly ? null : loadingLabel}
              <ProgressCircle
                size={isCompact ? 'sm' : 'md'}
                aria-hidden="true"
                aria-label={isLoadingAriaLiveLabel}
                isIndeterminate
              />
            </>
          ) : (
            <>
              {startVisual ?? startVisual}
              {children}
              {endVisual ?? endVisual}
            </>
          )}
        </span>
      </a>
    );
  },
);

Link.displayName = 'Link';

export { Link };
