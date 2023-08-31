import { closeButtonClass, tagClass, tagLabelClass } from './Tag.css';

import { SystemIcon } from '@components/Icon';
import React, { type FC } from 'react';

export interface ITagProps {
  children: string;
  onClose?: () => void;
}

export const Tag: FC<ITagProps> = ({ children, onClose }) => {
  return (
    <span data-testid="kda-tag" className={tagClass}>
      <span className={tagLabelClass}>{children}</span>
      {onClose ? (
        <button className={closeButtonClass} onClick={onClose}>
          <SystemIcon.Close size="sm" />
        </button>
      ) : null}
    </span>
  );
};
