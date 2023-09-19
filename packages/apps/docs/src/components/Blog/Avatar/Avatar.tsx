import { avatarClass } from './styles.css';

import { getInitials } from '@/utils';
import Image from 'next/image';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  name?: string;
  avatar?: string;
}

export const Avatar: FC<IProps> = ({ name, avatar }) => {
  if (avatar) {
    return (
      <div>
        <Image
          className={avatarClass}
          src={avatar}
          width={40}
          height={40}
          alt={`avatar: ${name}`}
        />
      </div>
    );
  }
  if (name) {
    return <div className={avatarClass}>{getInitials(name)}</div>;
  }

  return null;
};
