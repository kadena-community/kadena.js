'use client';

import { PageNav } from './PageNav';
import { PageNum } from './PageNum';
import { paginate } from './paginate';
import { listClass } from './Pagination.css';

import React, { type FC, useState } from 'react';

export interface IPaginationProps {
  totalPages: number;
  currentPage?: number;
  label: string;
  visiblePageLimit?: number;
  initialSelectedPage?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<IPaginationProps> = ({
  totalPages,
  currentPage,
  label,
  visiblePageLimit = 3,
  initialSelectedPage,
  onPageChange,
}) => {
  const validInitialSelectedPage =
    initialSelectedPage &&
    initialSelectedPage <= totalPages &&
    initialSelectedPage > 0;

  const [_page, setPage] = useState(
    validInitialSelectedPage ? initialSelectedPage : 1,
  );
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
          <li key={pageNum}>
            <PageNum
              key={pageNum}
              number={pageNum}
              current={pageNum === page}
              onClick={() => onClick(pageNum)}
            />
          </li>
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
