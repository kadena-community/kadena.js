import { useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type { ForwardedRef, ReactElement } from 'react';
import React, { forwardRef } from 'react';
import type { AriaFocusRingProps } from 'react-aria';
import type { IAvatarProps } from '../Avatar';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import type { IBaseButtonProps } from '../Button/BaseButton/BaseButton';
import {
  avatarStyle,
  badgeStyle,
  centerContentWrapper,
  directionStyle,
  disabledBadgeStyle,
  iconOnlyStyle,
  isCompactStyle,
  noPostfixStyle,
  noPrefixStyle,
  postfixIconStyle,
  prefixIconStyle,
} from '../Button/Button.css';
import { disableLoadingProps, renderIcon } from '../Button/utils';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';
import { BaseLink } from './BaseLink';

type BaseProps = Omit<AriaFocusRingProps, 'isTextInput'> &
  Pick<
    IBaseButtonProps,
    | 'variant'
    | 'isCompact'
    | 'style'
    | 'children'
    | 'className'
    | 'title'
    | 'isDisabled'
    | 'isLoading'
    | 'aria-label'
    | 'type'
    | 'href'
  >;

export interface ILinkProps extends BaseProps {
  avatarProps?: Omit<IAvatarProps, 'size'>;
  badgeValue?: string | number;
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
  loadingLabel?: string;
}

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

const Link = forwardRef(
  (
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
      className,
      ...props
    }: ILinkProps,
    forwardedRef: ForwardedRef<HTMLAnchorElement>,
  ) => {
    props = disableLoadingProps(props);
    const ref = useObjectRef(forwardedRef);

    const startIcon = iconPosition === 'start' && icon;
    const endIcon = iconPosition === 'end' && icon;
    const iconOnly =
      (icon && !children) || (loadingLabel === '' && props.isLoading);
    const isLoading = props.isLoading && loadingLabel !== '';

    const isLoadingAriaLiveLabel = `${
      typeof children === 'string' ? children : props['aria-label'] ?? 'is'
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
      <BaseLink
        {...props}
        variant={variant}
        isCompact={isCompact}
        className={classNames(className, isCompactStyle[`${isCompact}`])}
        ref={ref}
      >
        {content}
      </BaseLink>
    );
  },
);

Link.displayName = 'Link';

export { Link };
