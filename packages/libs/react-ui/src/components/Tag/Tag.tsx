import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
import React from 'react';
import { closeButtonClass, tagClass, tagLabelClass } from './Tag.css';

export interface ITagProps {
  children: React.ReactNode;
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
