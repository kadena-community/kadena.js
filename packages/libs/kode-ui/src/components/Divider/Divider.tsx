import type { RecipeVariants } from '@vanilla-extract/recipes';
import cn from 'classnames';
import type { ComponentPropsWithRef, FC } from 'react';
import React from 'react';
import { useSeparator } from 'react-aria';
import { dividerClass } from './Divider.css';

type Variants = NonNullable<RecipeVariants<typeof dividerClass>>;

export interface IDividerProps extends ComponentPropsWithRef<'hr'> {
  variant?: Variants['variant'];
}

export const Divider: FC<IDividerProps> = ({
  className,
  variant = 'base',
  ...props
}) => {
  const { separatorProps } = useSeparator({
    ...props,
    elementType: 'hr',
    orientation: 'horizontal',
  });

  return (
    <hr
      className={cn(dividerClass({ variant }), className)}
      {...separatorProps}
    />
  );
};
