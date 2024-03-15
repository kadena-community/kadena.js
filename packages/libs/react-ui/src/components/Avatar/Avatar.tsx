import type { ReactElement } from 'react';
import React from 'react';

import type { RecipeVariants } from '@vanilla-extract/recipes';

import { MonoQuestionMark } from '@kadena/react-icons/system';
import { circle, circleStatus } from './Avatar.css';
import { getInitials } from './getInitials';

type StatusVariants = NonNullable<RecipeVariants<typeof circleStatus>>;
type CircleVariants = NonNullable<RecipeVariants<typeof circle>>;
export interface IAvatarProps extends StatusVariants, CircleVariants {
  name?: string;
  imageUrl?: string;
  icon?: ReactElement;
}

export const Avatar = ({
  size,
  status,
  name,
  imageUrl,
  icon,
  color,
}: IAvatarProps) => {
  const initials = getInitials(name);
  const mainCircleStyle = imageUrl
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }
    : {};

  return (
    <div
      className={circle({ size: size, color: color })}
      style={mainCircleStyle}
    >
      {imageUrl ? null : initials ? (
        <span>{initials}</span>
      ) : (
        icon || <MonoQuestionMark />
      )}
      {status && <div className={circleStatus({ size, status })}></div>}
    </div>
  );
};
