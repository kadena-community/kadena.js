import { mergeProps } from '@react-aria/utils';
import type { ElementType, FC, PropsWithChildren } from 'react';
import React from 'react';
import { useFocusRing } from 'react-aria';
import { Stack } from '../Layout/Stack/Stack';
import { tileClass } from './Tile.css';

export interface IProps {
  as?: ElementType;
  isDisabled?: boolean;
  hasFocus?: boolean;
}

export type ITileProps = PropsWithChildren<IProps>;

export const Tile: FC<ITileProps> = ({
  children,
  as = 'div',
  isDisabled = false,
  hasFocus,
}) => {
  const { focusProps, isFocused, isFocusVisible } = useFocusRing({
    autoFocus: hasFocus,
  });

  return (
    <Stack
      {...mergeProps(focusProps)}
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
