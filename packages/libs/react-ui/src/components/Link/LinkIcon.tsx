import { FC } from 'react';
import { iconContainerClass } from './Link.css';
import React from 'react';
import { SystemIcon } from '../Icons';

export interface ILinkIconProps {}

export const LinkIcon: FC<ILinkIconProps> = ({}) => {
  return (
    <span className={iconContainerClass}>
      <SystemIcon.Link size="md" />
    </span>
  );
};
