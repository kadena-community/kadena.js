import { iconContainerClass } from './Link.css';

import { SystemIcon } from '@components/Icon';
import React, { FC } from 'react';

export const LinkIcon: FC = () => {
  return (
    <span className={iconContainerClass}>
      <SystemIcon.Link size="md" />
    </span>
  );
};
