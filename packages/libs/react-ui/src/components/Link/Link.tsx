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
  endVisualStyle,
  iconOnlyStyle,
  noEndVisualStyle,
  noStartVisualStyle,
  reverseDirectionStyle,
  startVisualStyle,
} from '../Button/Button.css';
import { disableLoadingProps } from '../Button/utils';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';

type Variants = NonNullable<RecipeVariants<typeof button>>;

export type ILinkProps = Omit<AriaFocusRingProps, 'isTextInput'> &
  Variants &
  Pick<AriaButtonProps<'button'>, 'aria-label' | 'href' | 'type' | 'target'> & {
    className?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    title?: string;
    style?: React.CSSProperties;
    loadingLabel?: string;
    children?: string | number | ReactElement;
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
    const { isLoading, isDisabled, style, title } = props;

    const iconOnly = Boolean(
      // check if children is a ReactElement
      (typeof children !== 'string' && typeof children !== 'number') ||
        // check if no visuals are provided
        (!startVisual && !endVisual && !children) ||
        // check if only one visual is provided
        (!children &&
          ((startVisual && !endVisual) || (endVisual && !startVisual))),
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
            isLoading,
          }),
          className,
        )}
        style={style}
        title={title}
        aria-disabled={isLoading || undefined}
        data-disabled={isDisabled || undefined}
        data-pressed={isPressed || undefined}
        data-hovered={(!isPressed && isHovered) || undefined}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        ref={ref}
      >
        <>
          {isLoading ? (
            <span
              className={classNames(
                !loadingLabel
                  ? iconOnlyStyle
                  : {
                      [noEndVisualStyle]: !endVisual && startVisual,
                      [noStartVisualStyle]: !startVisual || endVisual,
                      [startVisualStyle]: startVisual && !endVisual,
                      [endVisualStyle]: endVisual || !startVisual,
                      [reverseDirectionStyle]: startVisual && !endVisual,
                    },
                centerContentWrapper,
              )}
            >
              {iconOnly && !loadingLabel ? null : loadingLabel}
              <ProgressCircle
                size={isCompact ? 'sm' : 'md'}
                aria-hidden="true"
                aria-label={isLoadingAriaLiveLabel}
                isIndeterminate
              />
            </span>
          ) : (
            <span
              className={classNames(
                iconOnly
                  ? iconOnlyStyle
                  : {
                      [noEndVisualStyle]: !endVisual,
                      [noStartVisualStyle]: !startVisual,
                      [startVisualStyle]: startVisual,
                      [endVisualStyle]: endVisual,
                      [centerContentWrapper]: true,
                    },
              )}
            >
              {startVisual ?? startVisual}
              {children}
              {endVisual ?? endVisual}
            </span>
          )}
        </>
      </a>
    );
  },
);

Link.displayName = 'Link';

export { Link };
