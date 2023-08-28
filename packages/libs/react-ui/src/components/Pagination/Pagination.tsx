'use client';

import { PageNav } from './PageNav';
import { PageNum } from './PageNum';
import { paginate } from './paginate';
import { listClass } from './Pagination.css';

import type { FC } from 'react';
import React, { useState } from 'react';

export interface IPaginationProps {
  totalPages: number;
  currentPage?: number;
  label: string;
  visiblePageLimit?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<IPaginationProps> = ({
  totalPages,
  currentPage,
  label,
  visiblePageLimit = 3,
  onPageChange,
}) => {
  const [_page, setPage] = useState(1);
  const page = currentPage || _page;
  const pages = paginate({
    page,
    total: totalPages,
    maxPages: visiblePageLimit,
  });
  const enablePrevious = page > 1;
  const enableNext = page < totalPages;

  const onClick = (page: number): void => {
    setPage(page);
    onPageChange(page);
  };

  return (
    <nav aria-label={label}>
      <ul className={listClass}>
        <li>
          <PageNav
            label="Previous"
            direction="prev"
            disabled={!enablePrevious}
            onClick={() => onClick(page - 1)}
          />
        </li>
        {pages.map((pageNum) => (
          <PageNum
            key={pageNum}
            number={pageNum}
            current={pageNum === page}
            onClick={() => onClick(pageNum)}
          />
        ))}
        <li>
          <PageNav
            label="Next"
            direction="next"
            disabled={!enableNext}
            onClick={() => onClick(page + 1)}
          />
        </li>
      </ul>
    </nav>
  );
};
