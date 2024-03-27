import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type {
  ComponentProps,
  ElementRef,
  ForwardedRef,
  ReactNode,
} from 'react';
import React, { forwardRef } from 'react';
import type { AriaLinkOptions, HoverEvents } from 'react-aria';
import { useFocusRing, useHover, useLink } from 'react-aria';
import { button } from '../Button/Button.css';
import { disableLoadingProps } from '../Button/utils';
import { ProgressCircle } from '../ProgressCircle/ProgressCircle';

type Variants = Omit<NonNullable<RecipeVariants<typeof button>>, 'onlyIcon'>;
type PickedAriaLinkProps = Omit<AriaLinkOptions, 'elementType'>;

export interface ILinkProps extends PickedAriaLinkProps, HoverEvents, Variants {
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  /**
   * @deprecated use `onPress` instead to be consistent with React Aria, also keep in mind that `onPress` is not a native event it is a synthetic event created by React Aria
   * @see https://react-spectrum.adobe.com/react-aria/useButton.html#props
   */
  onClick?: ComponentProps<'button'>['onClick'];
  style?: ComponentProps<'button'>['style'];
  title?: ComponentProps<'button'>['title'];
}

function BaseLink(
  props: ILinkProps,
  forwardedRef: ForwardedRef<ElementRef<'a'>>,
) {
  props = disableLoadingProps(props);
  const ref = useObjectRef(forwardedRef);
  const { linkProps, isPressed } = useLink(props, ref);
  const { hoverProps, isHovered } = useHover(props);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);

  const onlyIcon = props.icon !== undefined;
  const content = onlyIcon ? (
    props.icon
  ) : (
    <>
      {props.startIcon}
      {props.children}
      {props.endIcon}
    </>
  );

  const isLoadingAriaLiveLabel = `${
    typeof props.children === 'string'
      ? props.children
      : linkProps['aria-label'] ?? 'is'
  } loading`.trim();

  return (
    <a
      {...mergeProps(linkProps, hoverProps, focusProps)}
      ref={ref}
      className={classNames(
        button({
          variant: props.variant,
          isCompact: props.isCompact,
          isLoading: props.isLoading,
        }),
        props.className,
      )}
      style={props.style}
      title={props.title}
      aria-disabled={props.isLoading || undefined}
      data-disabled={props.isDisabled || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
    >
      {props.isLoading ? (
        <>
          {onlyIcon ? null : 'Loading'}
          <ProgressCircle
            aria-hidden="true"
            aria-label={isLoadingAriaLiveLabel}
            isIndeterminate
          />
        </>
      ) : (
        content
      )}
    </a>
  );
}

export const Link = forwardRef(BaseLink);
