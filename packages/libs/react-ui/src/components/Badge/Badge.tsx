import React from 'react';

import type { RecipeVariants } from '@vanilla-extract/recipes';
import { circle, status } from './Badge.css';
import { getInitials } from './getInitials';
type statusVariants = NonNullable<RecipeVariants<typeof status>>;
type circleVariants = NonNullable<RecipeVariants<typeof circle>>;
export interface IBadgeProps extends statusVariants, circleVariants {
  name?: string;
  imageUrl?: string;
  // accept it and use prios
  // icon situaton, fallback in case nothing provided OR we actually allow any icon
}

export const Badge = (props: IBadgeProps) => {
  const initials = getInitials(props.name);
  const mainCircleStyle = props.imageUrl
    ? { backgroundImage: `url(${props.imageUrl})`, backgroundSize: 'cover' }
    : {};
  console.log(props);

  return (
    <div className={circle({ size: props.size })} style={mainCircleStyle}>
      <span>{initials}</span>
      <div className={status({ color: props.color, size: props.size })}></div>
    </div>
  );
};
