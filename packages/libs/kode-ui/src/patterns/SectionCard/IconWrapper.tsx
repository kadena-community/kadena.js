import type { FC } from 'react';
import React from 'react';
import { Stack } from './../../components';
import { LoaderIcon } from './LoaderIcon';
import type { ISectionCardProps } from './SectionCard';
import { iconWrapperClass, loadingIconClass } from './style.css';

interface IIconsProps {
  icon: ISectionCardProps['icon'];
  intent: ISectionCardProps['intent'];
  variant: ISectionCardProps['variant'];
  isLoading: boolean;
}

export const IconWrapper: FC<IIconsProps> = ({ icon, intent, isLoading }) => {
  if (!icon) return null;

  return (
    <Stack className={iconWrapperClass({ intent, isLoading })}>
      {icon}
      {isLoading && <LoaderIcon className={loadingIconClass({ intent })} />}
    </Stack>
  );
};
