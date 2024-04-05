import type { ReactElement } from 'react';
import React from 'react';

import type { RecipeVariants } from '@vanilla-extract/recipes';

import { MonoQuestionMark } from '@kadena/react-icons/system';
import classNames from 'classnames';
import { circle, circleStatus, disabledStyle } from './Avatar.css';
import { getInitials } from './getInitials';

type StatusVariants = NonNullable<RecipeVariants<typeof circleStatus>>;
type CircleVariants = NonNullable<RecipeVariants<typeof circle>>;

export interface IAvatarProps extends StatusVariants, CircleVariants {
  name?: string;
  // could also be a component if we need to
  imageUrl?: string;
  icon?: ReactElement;
  isDisabled?: boolean;
}

const Avatar = ({
  size,
  status,
  name,
  imageUrl,
  icon,
  color,
  isDisabled = false,
}: IAvatarProps) => {
  const initials = getInitials(name);
  const mainCircleStyle = imageUrl
    ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }
    : {};

  return (
    <div
      className={classNames(circle({ size: size, color: color }), {
        [disabledStyle]: isDisabled,
      })}
      style={mainCircleStyle}
    >
      {imageUrl ? null : initials && size !== 'sm' ? (
        <span>{initials}</span>
      ) : (
        icon || <MonoQuestionMark />
      )}

      {status && <div className={circleStatus({ size, status })}></div>}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export { Avatar };
