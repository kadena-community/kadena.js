import {
  MonoKeyboardArrowLeft,
  MonoKeyboardArrowRight,
} from '@kadena/kode-icons/system';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import PaginationButton from './pagination-button/pagination-button';

const TablePagination: FC = () => {
  return (
    <Stack as="ul" gap="xs">
      <PaginationButton>
        <MonoKeyboardArrowLeft />
      </PaginationButton>
      <PaginationButton>1</PaginationButton>
      <PaginationButton>d</PaginationButton>
      <PaginationButton>d</PaginationButton>
      <PaginationButton>
        <MonoKeyboardArrowRight />
      </PaginationButton>
    </Stack>
  );
};

export default TablePagination;
