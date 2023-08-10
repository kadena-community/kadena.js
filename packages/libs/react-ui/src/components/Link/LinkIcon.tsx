import { SystemIcon } from '@components/Icon';
import React, { FC } from 'react';

type IconProps = JSX.IntrinsicElements['i'];
export interface ILinkIconProps extends IconProps {
  icon: (typeof SystemIcon)[keyof typeof SystemIcon];
}

export const LinkIcon: FC<ILinkIconProps> = ({ icon, className }) => {
  const Icon = icon;
  return <Icon size="md" className={className} />;
};
