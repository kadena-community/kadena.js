import { getInitials } from '@/utils/author';
import classNames from 'classnames';
import Image from 'next/image';
import type { FC } from 'react';
import React from 'react';
import { avatarClass, avatarSizeVariant } from './styles.css';

interface IProps {
  name: string;
  avatar?: string;
  size?: 'default' | 'large';
}

export const Avatar: FC<IProps> = ({ name, avatar, size = 'default' }) => {
  if (avatar) {
    const avatarSize = size === 'large' ? 50 : 30;

    return (
      <Image
        className={classNames(avatarClass, avatarSizeVariant[size])}
        src={avatar}
        width={avatarSize}
        height={avatarSize}
        alt={name}
        title={name}
      />
    );
  }

  return (
    <div className={classNames(avatarClass, avatarSizeVariant[size])}>
      {getInitials(name)}
    </div>
  );
};
