import { mergeProps } from '@react-aria/utils';
import type { ElementType, FC, PropsWithChildren } from 'react';
import React from 'react';
import type { AriaButtonProps } from 'react-aria';
import { useFocusRing } from 'react-aria';
import { Stack } from '../Layout/Stack/Stack';
import { tileClass } from './Tile.css';

export type IProps = Pick<AriaButtonProps<'button'>, 'aria-label'> & {
  as?: ElementType;
  isDisabled?: boolean;
  hasFocus?: boolean;
  onClick?: React.MouseEventHandler;
};

export type ITileProps = PropsWithChildren<IProps>;

export const Tile: FC<ITileProps> = ({
  children,
  as = 'div',
  isDisabled = false,
  hasFocus,
  onClick,
  ...props
}) => {
  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    autoFocus: hasFocus,
  });

  console.log({ props });

  return (
    <Stack
      {...mergeProps(focusProps, props)}
      onClick={onClick}
      as={as}
      className={tileClass}
      data-disabled={isDisabled || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
    >
      {children}
    </Stack>
  );
};
