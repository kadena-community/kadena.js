'use client';
import type { ComponentPropsWithRef, FC } from 'react';
import React, { useState } from 'react';
import { PageNav } from './PageNav';
import { PageNum } from './PageNum';
import { listClass } from './Pagination.css';
import { paginate } from './paginate';

export interface IPaginationProps extends ComponentPropsWithRef<'nav'> {
  totalPages: number;
  selectedPage?: number;
  visiblePageLimit?: number;
  defaultSelectedPage?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<IPaginationProps> = ({
  totalPages,
  selectedPage,
  visiblePageLimit = 3,
  defaultSelectedPage,
  onPageChange,
  ...props
}) => {
  const validDefaultSelectedPage =
    defaultSelectedPage &&
    defaultSelectedPage <= totalPages &&
    defaultSelectedPage > 0;

  const [_page, setPage] = useState(
    validDefaultSelectedPage ? defaultSelectedPage : 1,
  );
  const page = selectedPage || _page;
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
