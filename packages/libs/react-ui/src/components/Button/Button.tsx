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
  directionStyle,
  endVisualStyle,
  iconOnlyStyle,
  noEndVisualStyle,
  noStartVisualStyle,
  startVisualStyle,
} from './Button.css';
import { disableLoadingProps } from './utils';

type Variants = NonNullable<RecipeVariants<typeof button>>;

export type IButtonProps = Omit<AriaFocusRingProps, 'isTextInput'> &
  Variants &
  Omit<AriaFocusRingProps, 'isTextInput'> &
  Pick<AriaButtonProps<'button'>, 'aria-label' | 'onPress' | 'type'> & {
    className?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
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
      isCompact = false,
      loadingLabel = 'Loading',
      variant = 'primary',
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
      <button
        {...mergeProps(buttonProps, hoverProps, focusProps)}
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
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
