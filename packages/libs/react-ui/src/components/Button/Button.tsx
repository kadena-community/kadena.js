import { useObjectRef } from '@react-aria/utils';
import classNames from 'classnames';
import type { ForwardedRef, HTMLAttributes, ReactElement } from 'react';
import React, { forwardRef } from 'react';
import type { AriaFocusRingProps } from 'react-aria';
import type { IBaseButtonProps } from '.';
import { BaseButton } from '.';
import type { IAvatarProps } from '../Avatar';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';
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
} from './Button.css';
import { disableLoadingProps, renderIcon } from './utils';

type BaseProps = Omit<AriaFocusRingProps, 'isTextInput'> &
  Pick<
    IBaseButtonProps,
    | 'variant'
    | 'isCompact'
    | 'style'
    | 'className'
    | 'title'
    | 'isDisabled'
    | 'isLoading'
    | 'aria-label'
    | 'onPress'
    | 'type'
  > & {
    badgeValue?: string | number;
    loadingLabel?: string;
    children?: string | string[];
    onClick?: Pick<HTMLAttributes<HTMLButtonElement>, 'onClick'>['onClick'];
    icon?: ReactElement;
  };

export interface IButtonWithoutAvatar {
  iconPosition?: 'start' | 'end';
}

interface IButtonWithAvatar {
  avatarProps?: Omit<IAvatarProps, 'size'>;
  iconPosition?: 'end';
}

export type IButtonProps = (IButtonWithAvatar | IButtonWithoutAvatar) &
  BaseProps;

/**
 * Button component
 * @param onClick - use onPress whenever you can for accessibility, onClick allows backwards compatibility
 * @param onPress - callback when button is clicked
 * @param variant - button style variant
 * @param children - label to be shown
 * @param badgeValue - badge value to be shown after the label
 * @param icon - icon to be shown as only child
 * @param iconPosition - position of the icon either "start" or "end"
 * @param isDisabled - disabled state
 * @param isLoading - loading state
 * @param isCompact - compact button style
 * @param avatarProps - Props for the avatar component which can be rendered instead of startIcon
 * @param loadingLabel - label to be shown when loading
 * @param className - additional class name
 * @param style - additional style
 * @param title - title to be shown as HTML tooltip
 */

const Button = forwardRef(
  (
    {
      icon,
      iconPosition = 'end',
      children,
      badgeValue,
      isCompact = false,
      loadingLabel = 'Loading',
      variant = 'primary',
      className,
      ...props
    }: IButtonProps,
    forwardedRef: ForwardedRef<HTMLButtonElement>,
  ) => {
    props = disableLoadingProps(props);
    const ref = useObjectRef(forwardedRef);
    const avatarProps = 'avatarProps' in props ? props.avatarProps : undefined;
    const onPress = 'onPress' in props ? props.onPress : undefined;

    const startIcon = iconPosition === 'start' && icon;
    const endIcon = iconPosition === 'end' && icon;
    const iconOnly =
      (icon && !children) || (loadingLabel === '' && props.isLoading);
    const isLoading = props.isLoading && loadingLabel !== '';

    const isLoadingAriaLiveLabel = `${
      typeof children === 'string' ? children : props['aria-label'] ?? 'is'
    } loading`.trim();

    // Content to show before the children, either an icon or avatar
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
          // Spacing for when only the label and badge are shown
          [badgeStyle]: !postfixContent && badgeValue,
          // Spacing for when only the label is shown
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
      <BaseButton
        {...(props as BaseProps)}
        onPress={onPress}
        variant={variant}
        isCompact={isCompact}
        className={classNames(className, isCompactStyle[`${isCompact}`])}
        ref={ref}
      >
        {content}
      </BaseButton>
    );
  },
);

Button.displayName = 'Button';

export { Button };
