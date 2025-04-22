import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import cn from 'classnames';
import type { ComponentPropsWithRef, FC } from 'react';
import React from 'react';
import { useSeparator } from 'react-aria';
import { bgColor as bgColorVar, dividerClass } from './Divider.css';

type Variants = NonNullable<RecipeVariants<typeof dividerClass>>;

export interface IDividerProps extends ComponentPropsWithRef<'hr'> {
  variant?: Variants['variant'];
  label?: string;
  bgColor?: string;
}

export const Divider: FC<IDividerProps> = ({
  className,
  variant = 'base',
  label,
  bgColor,
  ...props
}) => {
  const { separatorProps } = useSeparator({
    ...props,
    elementType: 'hr',
    orientation: 'horizontal',
  });

  return (
    <hr
      className={cn(dividerClass({ variant, label: !!label }), className)}
      data-label={label}
      style={assignInlineVars({
        [bgColorVar]: bgColor,
      })}
      {...separatorProps}
    />
  );
};
