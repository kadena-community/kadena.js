import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type {
  ComponentProps,
  ForwardedRef,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from 'react';
import React, { cloneElement, forwardRef } from 'react';
import type { AriaButtonProps, AriaFocusRingProps } from 'react-aria';
import { useButton, useFocusRing, useHover, useLink } from 'react-aria';
import type { IAvatarProps } from '../Avatar';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';
import {
  avatarStyle,
  badgeStyle,
  button,
  centerContentWrapper,
  disabledBadgeStyle,
  iconOnlyStyle,
  iconStyle,
  noPostfixStyle,
  noPrefixStyle,
  postfixIconStyle,
  prefixIconStyle,
} from './Button.css';
import { disableLoadingProps } from './utils';

type Variants = NonNullable<RecipeVariants<typeof button>>;

type BaseProps = Omit<AriaFocusRingProps, 'isTextInput'> & Variants;

export interface ICustomProps extends BaseProps {
  avatarProps?: Omit<IAvatarProps, 'size'>;
  badgeValue?: string | number;
  children?: ReactNode | ReactNode[];
  className?: string;
  endIcon?: ReactElement;
  icon?: ReactElement;
  isDisabled?: boolean;
  startIcon?: ReactElement;
  loadingLabel?: string;
  style?: ComponentProps<'button'>['style'];
  // Title to be shown as HTML tooltip
  title?: ComponentProps<'button'>['title'];
}

interface IAnchorElementProps extends ICustomProps {
  onPress?: never;
  href: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export interface IButtonElementProps extends ICustomProps {
  type?: Pick<AriaButtonProps, 'type'>['type'];
  onPress?:
    | Pick<AriaButtonProps, 'onPress'>['onPress']
    | MouseEventHandler<HTMLButtonElement>;
  href?: never;
  target?: never;
}

export type IButtonProps = IAnchorElementProps | IButtonElementProps;

/**
 * Button component
 * @param onPress - callback when button is clicked
 * @param href - link to be opened when clicked, will render an anchor tag
 * @param target - target to be used when clicked the anchor
 * @param variant - button style variant
 * @param children - label to be shown
 * @param badgeValue - badge value to be shown after the label
 * @param icon - icon to be shown as only child
 * @param startIcon - icon to be shown before the children
 * @param endIcon - icon to be shown after the children
 * @param isDisabled - disabled state
 * @param isLoading - loading state
 * @param isCompact - compact button style
 * @param avatarProps - Props for the avatar component which can be rendered instead of startIcon
 * @param loadingLabel - label to be shown when loading
 * @param className - additional class name
 * @param style - additional style
 * @param title - title to be shown as HTML tooltip
 */

const renderIcon = (icon: ReactElement) =>
  cloneElement(icon, {
    className: iconStyle,
  });

const BaseButton = (
  {
    icon,
    startIcon,
    endIcon,
    children,
    avatarProps,
    badgeValue,
    isCompact = false,
    loadingLabel = 'Loading',
    variant = 'primary',
    href,
    ...props
  }: IButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) => {
  props = disableLoadingProps(props);
  const ref = useObjectRef(forwardedRef);
  const { buttonProps, isPressed } = useButton(props as ICustomProps, ref);
  const { linkProps, isPressed: isLinkPressed } = useLink(
    props as ICustomProps,
    ref,
  );
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

  const isLoadingAriaLiveLabel = `${
    typeof children === 'string' ? children : buttonProps['aria-label'] ?? 'is'
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
          renderIcon(startIcon as ReactElement)
        )}
      </span>
    ) : null;

  // Icon to be rendered after the center content
  const postfixContent = endIcon ? (
    <span className={postfixIconStyle}>{renderIcon(endIcon)}</span>
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

  // For buttons with icons only, only show the loader
  const content = props.isLoading ? (
    <span
      className={classNames({
        [`${noPrefixStyle} ${postfixIconStyle} ${centerContentWrapper}`]: !icon,
        [iconOnlyStyle]: icon,
      })}
    >
      {icon ? null : loadingLabel}
      <ProgressCircle
        size={isCompact ? 'sm' : 'md'}
        aria-hidden="true"
        aria-label={isLoadingAriaLiveLabel}
        isIndeterminate
      />
    </span>
  ) : icon ? (
    <span className={iconOnlyStyle}>{renderIcon(icon as ReactElement)}</span>
  ) : (
    <>
      {prefixContent}
      {centerContent}
      {postfixContent}
    </>
  );

  const sharedAttributes = {
    className: classNames(
      button({
        variant,
        isCompact,
        isLoading: props.isLoading,
      }),
      props.className,
    ),
    style: props.style,
    title: props.title,
    ['aria-disabled']: props.isLoading || undefined,
    ['data-disabled']: props.isDisabled || undefined,
    ['data-pressed']: isPressed || isLinkPressed || undefined,
    ['data-hovered']: (!isPressed && !isLinkPressed && isHovered) || undefined,
    ['data-focused']: isFocused || undefined,
    ['data-focus-visible']: isFocusVisible || undefined,
  };

  if (href) {
    return (
      <a
        {...{
          ...sharedAttributes,
          ...mergeProps(linkProps, hoverProps, focusProps),
          ref: ref as ForwardedRef<HTMLAnchorElement>,
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      {...{
        ...sharedAttributes,
        ...mergeProps(buttonProps, hoverProps, focusProps),
        ref: ref as ForwardedRef<HTMLButtonElement>,
      }}
    >
      {content}
    </button>
  );
};

export const Button = forwardRef(BaseButton);
