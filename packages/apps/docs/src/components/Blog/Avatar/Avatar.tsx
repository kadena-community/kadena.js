import { getInitials } from '@/utils/author';
import classNames from 'classnames';
import Image from 'next/image';
import type { FC } from 'react';
import React from 'react';
import { avatarClass, avatarSizeVariant } from './styles.css';

interface IProps {
  name?: string;
  avatar?: string;
  size?: 'default' | 'large';
}

export const Avatar: FC<IProps> = ({ name, avatar, size = 'default' }) => {
  if (avatar) {
    const avatarSize = size === 'large' ? 60 : 40;

    return (
      <Image
        className={classNames(avatarClass, avatarSizeVariant[size])}
        src={avatar}
        width={avatarSize}
        height={avatarSize}
        alt={`avatar: ${name}`}
      />
    );
  }
  if (name) {
    return <div className={avatarClass}>{getInitials(name)}</div>;
  }

  return null;
};
