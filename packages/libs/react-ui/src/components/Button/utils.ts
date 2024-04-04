import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { cloneElement } from 'react';
import type { HoverEvents } from 'react-aria';
import type { button } from './BaseButton/BaseButton.css';
import { iconStyle } from './Button.css';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function disableLoadingProps<T>(props: T): T {
  const newProps: any = { ...props };
  // Don't allow interaction while isPending is true
  if (newProps.isLoading) {
    newProps.onPress = undefined;
    newProps.onPressStart = undefined;
    newProps.onPressEnd = undefined;
    newProps.onPressChange = undefined;
    newProps.onPressUp = undefined;
    newProps.onKeyDown = undefined;
    newProps.onKeyUp = undefined;
    newProps.onClick = undefined;
  }
  return newProps;
}

export const renderIcon = (icon: ReactElement | undefined) => {
  if (icon === undefined) return null;

  return cloneElement(icon, {
    className: iconStyle,
  });
};

type Variants = Omit<NonNullable<RecipeVariants<typeof button>>, 'onlyIcon'>;
export interface ISharedButtonProps extends HoverEvents, Variants {
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  icon?: ReactNode;
  style?: ComponentProps<'button'>['style'];
  // Title to be shown as HTML tooltip
  title?: ComponentProps<'button'>['title'];
}
