import { MonoLink } from '@kadena/react-icons/system';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import type { AriaButtonProps, AriaFocusRingProps } from 'react-aria';
import { useFocusRing, useHover, useLink } from 'react-aria';
import {
  button,
  centerContentWrapper,
  endVisualStyle,
} from '../Button/Button.css';
import { disableLoadingProps } from '../Button/utils';
import { textLinkClass } from './TextLink.css';

type Variants = NonNullable<RecipeVariants<typeof button>>;

export type ITextLinkProps = Omit<AriaFocusRingProps, 'isTextInput'> &
  Variants &
  Pick<AriaButtonProps<'button'>, 'aria-label' | 'href' | 'type' | 'target'> & {
    className?: string;
    isDisabled?: boolean;
    title?: string;
    style?: React.CSSProperties;
    children?: string | number;
  };

/**
 * TextLink component
 * @param children - label to be shown
 * @param isDisabled - disabled state
 * @param isCompact - compact button style
 * @param className - additional class name
 * @param style - additional style
 * @param title - title to be shown as HTML tooltip
 */

const TextLink = forwardRef(
  (
    { isCompact = false, children, className, ...props }: ITextLinkProps,
    forwardedRef: ForwardedRef<HTMLAnchorElement>,
  ) => {
    props = disableLoadingProps(props);
    const ref = useObjectRef(forwardedRef);
    const { linkProps, isPressed } = useLink(props, ref);
    const { hoverProps, isHovered } = useHover(props);
    const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);
    const { isDisabled, style, title } = props;

    return (
      <a
        {...mergeProps(linkProps, hoverProps, focusProps)}
        className={classNames(
          button({
            variant: 'transparent',
            isCompact,
          }),
          textLinkClass,
          className,
        )}
        style={style}
        title={title}
        data-disabled={isDisabled || undefined}
        data-pressed={isPressed || undefined}
        data-hovered={(!isPressed && isHovered) || undefined}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        ref={ref}
      >
        <>
          {
            <span
              className={classNames({
                endVisualStyle,
                [centerContentWrapper]: true,
              })}
            >
              {children}
              <MonoLink />
            </span>
          }
        </>
      </a>
    );
  },
);

TextLink.displayName = 'TextLink';

export { TextLink };
