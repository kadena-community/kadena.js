import { SystemIcon } from '@components/Icon';
import type { FC } from 'react';
import React from 'react';
import { pageNavButtonClass, pageNavLabelClass } from './Pagination.css';

interface IPageNavProps {
  label: string;
  direction?: 'prev' | 'next';
  disabled?: boolean;
  onClick: () => void;
}

export const PageNav: FC<IPageNavProps> = ({
  label,
  direction,
  disabled = false,
  onClick,
}) => {
  const isPrevious = direction === 'prev';
  const isNext = direction === 'next';

  return (
    <button
      className={pageNavButtonClass}
      disabled={disabled}
      onClick={onClick}
    >
      {isPrevious ? <SystemIcon.LeadingIcon /> : null}
      <span className={pageNavLabelClass}>{label}</span>
      {isNext ? <SystemIcon.TrailingIcon /> : null}
    </button>
  );
};
