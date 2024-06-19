import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type { ForwardedRef, HTMLAttributes, ReactElement } from 'react';
import React, { forwardRef } from 'react';
import type { AriaButtonProps, AriaFocusRingProps } from 'react-aria';
import { useButton, useFocusRing, useHover } from 'react-aria';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';
import {
  button,
  centerContentWrapper,
  endVisualStyle,
  iconOnlyStyle,
  noEndVisualStyle,
  noStartVisualStyle,
  reverseDirectionStyle,
  startVisualStyle,
} from './Button.css';
import { disableLoadingProps } from './utils';

type Variants = NonNullable<RecipeVariants<typeof button>>;

export type IButtonProps = Omit<AriaFocusRingProps, 'isTextInput'> &
  Omit<Variants, 'icCompact'> &
  Pick<AriaButtonProps<'button'>, 'aria-label' | 'onPress' | 'type'> & {
    className?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    isCompact?: boolean;
    title?: string;
    style?: React.CSSProperties;
    loadingLabel?: string;
    children?: string | number | ReactElement;
    onClick?: Pick<HTMLAttributes<HTMLButtonElement>, 'onClick'>['onClick'];
    startVisual?: ReactElement;
    endVisual?: ReactElement;
  };

/**
 * Button component
 * @param onClick - use onPress whenever you can for accessibility, onClick allows backwards compatibility
 * @param onPress - callback when button is clicked
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

const Button = forwardRef(
  (
    {
      startVisual,
      endVisual,
      children,
      loadingLabel = 'Loading',
      variant = 'primary',
      isCompact = false,
      className,
      ...props
    }: IButtonProps,
    forwardedRef: ForwardedRef<HTMLButtonElement>,
  ) => {
    props = disableLoadingProps(props);
    loadingLabel = loadingLabel.trim();
    const ref = useObjectRef(forwardedRef);
    const { buttonProps, isPressed } = useButton(props, ref);
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
      <button
        {...mergeProps(buttonProps, hoverProps, focusProps)}
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
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
