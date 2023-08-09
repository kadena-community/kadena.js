import { PageNav } from './PageNav';
import { PageNum } from './PageNum';
import { paginate } from './paginate';
import { listClass } from './Pagination.css';

import React, { FC } from 'react';

export interface IPaginationProps {
  total: number;
  page: number;
  label: string;
  pageLimit?: number;
  onPageChange: (page: number) => void;
}

export const Pagination: FC<IPaginationProps> = ({
  total,
  page,
  label,
  pageLimit = 3,
  onPageChange,
}) => {
  const pages = paginate({ page, total, maxPages: pageLimit });
  const enablePrevious = page > 1;
  const enableNext = page < total;

  return (
    <nav aria-label={label}>
      <ul className={listClass}>
        <li>
          <PageNav
            label="Previous"
            direction="prev"
            disabled={!enablePrevious}
            onClick={() => onPageChange(page - 1)}
          />
        </li>
        {pages.map((pageNum) => (
          <PageNum
            key={pageNum}
            number={pageNum}
            current={pageNum === page}
            onClick={() => onPageChange(pageNum)}
          />
        ))}
        <li>
          <PageNav
            label="Next"
            direction="next"
            disabled={!enableNext}
            onClick={() => onPageChange(page + 1)}
          />
        </li>
      </ul>
    </nav>
  );
};
