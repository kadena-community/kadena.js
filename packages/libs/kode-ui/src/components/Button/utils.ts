import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ComponentProps, ReactNode } from 'react';
import type { HoverEvents } from 'react-aria';
import type { button } from './Button.css';

export function disableLoadingProps<T>(props: T): T {
  const newProps: any = { ...props };
  // Don't allow interaction while isPending is true
  if (newProps?.isLoading) {
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
