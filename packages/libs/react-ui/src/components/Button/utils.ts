import type { RecipeVariants } from '@vanilla-extract/recipes';
import type { ComponentProps, ReactNode } from 'react';
import type { HoverEvents } from 'react-aria';
import type { button } from './SharedButton.css';

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

type Variants = Omit<NonNullable<RecipeVariants<typeof button>>, 'onlyIcon'>;
export interface ISharedButtonProps extends HoverEvents, Variants {
  className?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  icon?: ReactNode;
  /**
   * @deprecated use `onPress` instead to be consistent with React Aria, also keep in mind that `onPress` is not a native event it is a synthetic event created by React Aria
   * @see https://react-spectrum.adobe.com/react-aria/useButton.html#props
   */
  onClick?: ComponentProps<'button'>['onClick'];
  style?: ComponentProps<'button'>['style'];
  title?: ComponentProps<'button'>['title'];
}
