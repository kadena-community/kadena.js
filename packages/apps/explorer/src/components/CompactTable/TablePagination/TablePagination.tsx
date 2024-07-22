import {
  MonoKeyboardArrowLeft,
  MonoKeyboardArrowRight,
} from '@kadena/kode-icons/system';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import { PaginationButton } from './PaginationButton/PaginationButton';
import { paginationClass } from './styles.css';

export interface ITablePaginationPageOptions {
  after?: string | null;
  before?: string | null;
  first?: number | null;
  last?: number | null;
}
interface IProps {
  totalCount: number;
  pageSize: number;
  setPage: (page: ITablePaginationPageOptions) => void;
  pageInfo: {
    endCursor?: string | null;
    startCursor?: string | null;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

export const TablePagination: FC<IProps> = ({
  pageSize,
  totalCount,
  setPage,
  pageInfo,
}) => {
  const handlePageSelect = (direction: string) => () => {
    if (direction === 'next') {
      setPage({ after: pageInfo.endCursor, first: pageSize });
    }
    if (direction === 'previous') {
      setPage({ before: pageInfo.startCursor, last: pageSize });
    }
    if (direction === 'first') {
      setPage({ first: pageSize });
    }
    if (direction === 'last') {
      setPage({ last: totalCount % pageSize });
    }
  };

  return (
    <Stack as="ul" gap="xs" className={paginationClass} marginBlockEnd="sm">
      <PaginationButton
        onClick={handlePageSelect('first')}
        isDisabled={!pageInfo.hasPreviousPage}
      >
        First
      </PaginationButton>
      <PaginationButton
        onClick={handlePageSelect('previous')}
        isDisabled={!pageInfo.hasPreviousPage}
      >
        <MonoKeyboardArrowLeft />
      </PaginationButton>

      <PaginationButton
        onClick={handlePageSelect('next')}
        isDisabled={!pageInfo.hasNextPage}
      >
        <MonoKeyboardArrowRight />
      </PaginationButton>
      <PaginationButton
        onClick={handlePageSelect('last')}
        isDisabled={!pageInfo.hasNextPage}
      >
        Last
      </PaginationButton>
    </Stack>
  );
};
