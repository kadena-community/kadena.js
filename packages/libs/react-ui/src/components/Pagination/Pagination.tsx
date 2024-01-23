'use client';
import type { FC, ReactComponentElement } from 'react';
import React, { useState } from 'react';
import { PageNav } from './PageNav';
import { PageNum } from './PageNum';
import { listClass } from './Pagination.css';
import { paginate } from './paginate';

export interface IPaginationProps extends ReactComponentElement<'nav'> {
  totalPages: number;
  currentPage?: number;
  visiblePageLimit?: number;
  initialSelectedPage?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<IPaginationProps> = ({
  totalPages,
  currentPage,
  visiblePageLimit = 3,
  initialSelectedPage,
  onPageChange,
  ...props
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
    <nav role="navigation" aria-label="Pagination navigation" {...props}>
      <ul className={listClass}>
        <li>
          <PageNav
            label="Previous"
            direction="prev"
            isDisabled={!enablePrevious}
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
            isDisabled={!enableNext}
            onClick={() => onClick(page + 1)}
          />
        </li>
      </ul>
    </nav>
  );
};
