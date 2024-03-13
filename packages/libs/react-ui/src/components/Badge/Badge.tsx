import React from 'react';

import type { RecipeVariants } from '@vanilla-extract/recipes';
import { SystemIcon } from '..';
import { circle, status } from './Badge.css';
import { getInitials } from './getInitials';

type Variants = NonNullable<RecipeVariants<typeof status>>;
export interface IBadgeProps extends Variants {
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
      {
        // If there is image, return it, otrhewise check for initials and last case SystemIcon.Account
        props.imageUrl ? null : initials ? (
          <span>{initials}</span>
        ) : (
          <SystemIcon.Account size="xl" />
        )
      }
      <div className={status({ color: props.color, size: props.size })}></div>
    </div>
  );
};
