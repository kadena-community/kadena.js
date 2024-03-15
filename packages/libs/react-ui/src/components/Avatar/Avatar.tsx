import type { ReactElement } from 'react';
import React from 'react';

import type { RecipeVariants } from '@vanilla-extract/recipes';

import { MonoQuestionMark } from '@kadena/react-icons/system'; // find icons list to type it
import { circle, status } from './Avatar.css';
import { getInitials } from './getInitials';

type StatusVariants = NonNullable<RecipeVariants<typeof status>>;
type CircleVariants = NonNullable<RecipeVariants<typeof circle>>;
export interface IAvatarProps extends StatusVariants, CircleVariants {
  name?: string;
  imageUrl?: string;
  icon?: ReactElement;
}

export const Avatar = (props: IAvatarProps) => {
  const initials = getInitials(props.name);
  const mainCircleStyle = props.imageUrl
    ? { backgroundImage: `url(${props.imageUrl})`, backgroundSize: 'cover' }
    : {};

  return (
    <div
      className={circle({ size: props.size, color: props.color })}
      style={mainCircleStyle}
    >
      {props.imageUrl ? null : initials ? (
        <span>{initials}</span>
      ) : (
        props.icon || <MonoQuestionMark />
      )}
      {props.status && (
        <div
          className={status({ size: props.size, status: props.status })}
        ></div>
      )}
    </div>
  );
};
