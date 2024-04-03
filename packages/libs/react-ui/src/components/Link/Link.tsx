import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type {
  ComponentProps,
  ForwardedRef,
  ReactElement,
  ReactNode,
} from 'react';
import React, { cloneElement, forwardRef } from 'react';
import type { AriaButtonProps, AriaFocusRingProps } from 'react-aria';
import { useFocusRing, useHover, useLink } from 'react-aria';
import type { IAvatarProps } from '../Avatar';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import {
  avatarStyle,
  badgeStyle,
  button,
  centerContentWrapper,
  directionStyle,
  disabledBadgeStyle,
  iconOnlyStyle,
  iconStyle,
  noPostfixStyle,
  noPrefixStyle,
  postfixIconStyle,
  prefixIconStyle,
} from '../Button/Button.css';
import { disableLoadingProps } from '../Button/utils';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';

type Variants = NonNullable<RecipeVariants<typeof button>>;

type BaseProps = Omit<AriaFocusRingProps, 'isTextInput'> & Variants;

export interface ILinkProps extends BaseProps {
  // manual override for icon only buttons
  ariaLabel?: Pick<AriaButtonProps, 'aria-label'>['aria-label'];
  avatarProps?: Omit<IAvatarProps, 'size'>;
  badgeValue?: string | number;
  children?: ReactNode | ReactNode[];
  className?: string;
  href: string | undefined;
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
  isDisabled?: boolean;
  loadingLabel?: string;
  style?: ComponentProps<'button'>['style'];
  target?: '_self' | '_blank' | '_parent' | '_top';
  // Title to be shown as HTML tooltip
  title?: ComponentProps<'button'>['title'];
}

const renderIcon = (icon: ReactElement | undefined) => {
  if (icon === undefined) return null;

  return cloneElement(icon, {
    className: iconStyle,
  });
};

/**
 * Link component
 * @param avatarProps - Props for the avatar component which can be rendered instead of startIcon
 * @param badgeValue - badge value to be shown after the label
 * @param children - label to be shown
 * @param className - additional class name
 * @param href - link to be opened when clicked, will render an anchor tag
 * @param icon - icon to be shown as only child
 * @param iconPosition - position of the icon either "start" or "end"
 * @param isCompact - compact button style
 * @param isDisabled - disabled state
 * @param isLoading - loading state
 * @param loadingLabel - label to be shown when loading
 * @param style - additional style
 * @param target - target to be used when clicked the anchor
 * @param title - title to be shown as HTML tooltip
 * @param variant - button style variant
 */

const BaseLink = (
  {
    avatarProps,
    badgeValue,
    children,
    href,
    icon,
    iconPosition = 'end',
    isCompact = false,
    loadingLabel = 'Loading',
    variant = 'primary',
    ...props
  }: ILinkProps,
  forwardedRef: ForwardedRef<HTMLAnchorElement>,
) => {
  props = disableLoadingProps(props);
  const ref = useObjectRef(forwardedRef);
  const { linkProps, isPressed } = useLink(props, ref);
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

  const startIcon = iconPosition === 'start' && icon;
  const endIcon = iconPosition === 'end' && icon;
  const iconOnly =
    (icon && !children) || (loadingLabel === '' && props.isLoading);
  const isLoading = props.isLoading && loadingLabel !== '';

  const isLoadingAriaLiveLabel = `${
    typeof children === 'string' ? children : linkProps['aria-label'] ?? 'is'
  } loading`.trim();

  // Content to show before the children
  const prefixContent =
    startIcon || avatarProps ? (
      <span className={startIcon ? prefixIconStyle : avatarStyle}>
        {avatarProps ? (
          <Avatar
            isDisabled={props.isDisabled}
            size={isCompact ? 'sm' : 'md'}
            {...avatarProps}
          />
        ) : (
          renderIcon(icon)
        )}
      </span>
    ) : null;

  // Icon to be rendered after the center content
  const postfixContent = endIcon ? (
    <span className={postfixIconStyle}>{renderIcon(icon)}</span>
  ) : null;

  // Content with optional badge component
  const centerContent = (
    <span
      className={classNames(centerContentWrapper, {
        [badgeStyle]: !postfixContent && badgeValue,
        [noPostfixStyle]: !postfixContent && !badgeValue,
        [noPrefixStyle]: !prefixContent,
      })}
    >
      {children}
      {badgeValue ? (
        <Badge
          size={'sm'}
          className={classNames({ [disabledBadgeStyle]: props.isDisabled })}
          style={
            ['outlined', 'transparent'].includes(variant) || props.isDisabled
              ? 'default'
              : 'inverse'
          }
        >
          {badgeValue}
        </Badge>
      ) : null}
    </span>
  );

  // For buttons with icons only or empty loader text, only show the loader
  const content = props.isLoading ? (
    <span
      className={classNames({
        [`${noPrefixStyle} ${postfixIconStyle} ${centerContentWrapper}`]:
          (endIcon && isLoading) || !iconOnly,
        [`${noPostfixStyle} ${prefixIconStyle} ${centerContentWrapper}`]:
          (startIcon && isLoading) || !iconOnly,
        [iconOnlyStyle]: iconOnly,
        [directionStyle]: startIcon,
      })}
    >
      {iconOnly ? null : loadingLabel}
      <ProgressCircle
        size={isCompact ? 'sm' : 'md'}
        aria-hidden="true"
        aria-label={isLoadingAriaLiveLabel}
        isIndeterminate
      />
    </span>
  ) : iconOnly ? (
    <span className={iconOnlyStyle}>{renderIcon(icon)}</span>
  ) : (
    <>
      {prefixContent}
      {centerContent}
      {postfixContent}
    </>
  );

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
      aria-label={props.ariaLabel}
      aria-disabled={props.isLoading || undefined}
      data-disabled={props.isDisabled || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={(!isPressed && isHovered) || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      ref={ref}
    >
      {content}
    </a>
  );
};

BaseLink.displayName = 'Link';

export const Link = forwardRef(BaseLink);
