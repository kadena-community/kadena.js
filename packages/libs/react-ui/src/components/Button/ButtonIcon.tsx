import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
import React from 'react';

type IconProps = JSX.IntrinsicElements['i'];
export interface IButtonIconProps extends IconProps {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
}

export const ButtonIcon: FC<IButtonIconProps> = ({ icon, className }) => {
  const Icon = icon;
  return <Icon size="md" className={className} />;
};
