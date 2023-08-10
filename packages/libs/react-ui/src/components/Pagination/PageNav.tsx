import { pageNavButtonClass, pageNavLabelClass } from './Pagination.css';

import { Box } from '@components/Box';
import { SystemIcon } from '@components/Icon';
import React, { FC } from 'react';

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
