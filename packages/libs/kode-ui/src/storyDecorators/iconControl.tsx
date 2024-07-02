import * as icons from '@kadena/react-icons';
import type { ReactElement } from 'react';
import React from 'react';

type Icons = keyof typeof icons;

const renderIcon = (icon: Icons) => {
  const IconComponent = icons[icon];
  return <IconComponent />;
};

const iconKeys = ['', ...Object.keys(icons)] as Array<Icons & ''>;

const mapping = iconKeys.reduce(
  (acc, key) => {
    if (key === '') return { ...acc, '': undefined };
    acc[key as Icons] = renderIcon(key);
    return acc;
  },
  {} as Record<Icons, ReactElement | undefined>,
);

export const iconControl = {
  control: {
    type: 'select',
  },
  options: iconKeys,
  mapping,
};
