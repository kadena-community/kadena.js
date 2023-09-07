import { avatar } from './styles.css';

import { getInitials } from '@/utils';
import type { FC } from 'react';
import React from 'react';

interface IProps {
  name?: string;
}

export const Avatar: FC<IProps> = ({ name }) => {
  if (!name) return null;

  return <div className={avatar}>{getInitials(name)}</div>;
};
