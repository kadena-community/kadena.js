import { SystemIcon } from '@components/Icon';

import React, { FC } from 'react';

export interface IButtonIconProps {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
}

export const ButtonIcon: FC<IButtonIconProps> = ({ icon }) => {
  const Icon = icon;
  return <Icon size="md" />;
};
