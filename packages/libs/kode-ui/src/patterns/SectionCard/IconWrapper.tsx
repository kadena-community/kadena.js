import { Mono123 } from '@kadena/kode-icons/system';
import type { FC } from 'react';
import React from 'react';
import { Stack } from './../../components';
import { ISectionCardProps } from './SectionCard';
import { iconWrapperClass } from './style.css';

interface IIconsProps {
  icon: ISectionCardProps['icon'];
  intent: ISectionCardProps['intent'];
  variant: ISectionCardProps['variant'];
  isLoading: boolean;
}

export const IconWrapper: FC<IIconsProps> = ({ icon, intent, isLoading }) => {
  if (!icon) return null;

  return <Stack className={iconWrapperClass({ intent })}>{icon}</Stack>;
};
