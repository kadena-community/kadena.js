import { avatar } from './styles.css';

import React, { FC } from 'react';

interface IProps {
  name?: string;
}

export const Avatar: FC<IProps> = ({ name }) => {
  if (!name) return null;

  const getInitials = (name: string): string => {
    return name.charAt(0);
  };
  return <div className={avatar}>{getInitials(name)}</div>;
};
