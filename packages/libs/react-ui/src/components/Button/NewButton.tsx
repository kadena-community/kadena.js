/* eslint-disable @kadena-dev/no-eslint-disable */

import { useObjectRef } from '@react-aria/utils';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import type {
  ComponentProps,
  ForwardedRef,
  MouseEvent,
  ReactNode,
} from 'react';
import React, { forwardRef, useCallback } from 'react';
import type { AriaButtonProps } from 'react-aria';
import { useButton } from 'react-aria';
import { Loading } from '../Icon/System/SystemIcon';
import { button, spinner } from './NewButton.css';

type Variants = Omit<NonNullable<RecipeVariants<typeof button>>, 'onlyIcon'>;
export interface IButtonProps extends AriaButtonProps, Variants {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  icon?: ReactNode;
  title?: string;
  /**
   * @deprecated use `onPress` instead to be consistent with React Aria, also keep in mind that `onPress` is not a native event it is a synthetic event created by React Aria
   * @see https://react-spectrum.adobe.com/react-aria/useButton.html#props
   */
  onClick?: ComponentProps<'button'>['onClick'];
}
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/function-component-definition */

function BaseButton(
  props: IButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>,
) {
  const ref = useObjectRef(forwardedRef);
  const { buttonProps } = useButton(props, ref);

  // support for deprecated `onClick` prop
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(event);
      buttonProps.onClick?.(event);
    },
    [props.onClick, buttonProps.onClick],
  );

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

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={button({
        onlyIcon,
        variant: props.variant,
        isCompact: props.isCompact,
        isOutlined: props.isOutlined,
      })}
      onClick={handleClick}
    >
      {props.isLoading ? (
        <>
          <Loading className={spinner} />
          {onlyIcon ? null : 'Loading'}
        </>
      ) : (
        content
      )}
    </button>
  );
}

export const NewButton = forwardRef(BaseButton);
