import { SystemIcon } from '../Icons';

import { iconContainerClass } from './Button.css';

import React, { FC } from 'react';

export interface IButtonIconProps {
  icon: typeof SystemIcon[keyof typeof SystemIcon];
}

export const ButtonIcon: FC<IButtonIconProps> = ({ icon }) => {
  const Icon = icon;
  return (
    <div className={iconContainerClass}>
      <Icon size="md" />
    </div>
  );
};
