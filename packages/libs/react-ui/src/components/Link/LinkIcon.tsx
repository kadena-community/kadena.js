import { SystemIcon } from '@components/Icon';

import { iconContainerClass } from './Link.css';

import React, { FC } from 'react';

export const LinkIcon: FC = () => {
  return (
    <span className={iconContainerClass}>
      <SystemIcon.Link size="md" />
    </span>
  );
};
