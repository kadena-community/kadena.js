import { mergeProps } from '@react-aria/utils';
import type { ElementType, FC, PropsWithChildren } from 'react';
import React from 'react';
import type { AriaButtonProps } from 'react-aria';
import { useFocusRing } from 'react-aria';
import { Stack } from '../Layout/Stack/Stack';
import { tileClass } from './Tile.css';

export type IProps = Pick<AriaButtonProps<'button'>, 'aria-label' | 'type'> & {
  as?: ElementType;
  isDisabled?: boolean;
  hasFocus?: boolean;
  onClick?: React.MouseEventHandler;
  isSelected?: boolean;
  stacked?: 'horizontal' | 'vertical';
};

export type ITileProps = PropsWithChildren<IProps>;

export const Tile: FC<ITileProps> = ({
  children,
  as = 'div',
  isDisabled = false,
  hasFocus,
  onClick,
  isSelected = false,
  stacked = 'horizontal',
  ...props
}) => {
  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    autoFocus: hasFocus,
  });

  return (
    <Stack
      {...mergeProps(focusProps, props)}
      onClick={onClick}
      as={as}
      className={tileClass}
      flexDirection={stacked === 'vertical' ? 'column' : 'row'}
      data-disabled={isDisabled || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-selected={isSelected || undefined}
      {...props}
    >
      {children}
    </Stack>
  );
};
