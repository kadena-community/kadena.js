import type { RecipeVariants } from '@vanilla-extract/recipes';
import classNames from 'classnames';
import React from 'react';
import { badge } from './Badge.css';

type Variants = NonNullable<RecipeVariants<typeof badge>>;

interface IBadgeProps {
  children: string | number;
  className?: string;
  size?: Variants['size'];
  style?: Variants['style'];
}

/**
 * @param children - Content to render
 * @param className - Optional styling
 * @param size - The size
 * @param inverse - Inverse the styling for usage on dark backgrounds
 */

const Badge = ({
  children,
  className,
  size = 'lg',
  style = 'default',
}: IBadgeProps) => {
  return (
    <span className={classNames(badge({ size, style }), className)}>
      {children}
    </span>
  );
};

export { Badge, IBadgeProps };
