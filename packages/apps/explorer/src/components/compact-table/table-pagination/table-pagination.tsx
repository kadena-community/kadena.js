import {
  MonoKeyboardArrowLeft,
  MonoKeyboardArrowRight,
  MonoRedo,
} from '@kadena/kode-icons/system';
import { Select, SelectItem, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import PaginationButton from './pagination-button/pagination-button';
import { paginationClass } from './styles.css';

interface IProps {
  totalCount: number;
  pageSize: number;
}

const TablePagination: FC<IProps> = ({ pageSize, totalCount }) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const pageArray = Array.from({ length: totalPages - 1 }, (_, i) => i).sort();
  console.log({ pageArray });
  return (
    <Stack as="ul" gap="xs" className={paginationClass}>
      <PaginationButton>
        <MonoKeyboardArrowLeft />
      </PaginationButton>
      {pageArray.map((item) => (
        <PaginationButton key={item}>{item}</PaginationButton>
      ))}

      <PaginationButton>
        <MonoKeyboardArrowRight />
      </PaginationButton>
      <Stack flex={1} />
      <Stack>
        {/* <Select defaultSelectedKey={1} placeholder="Select page">
          <SelectItem>
            <Stack alignItems="center" gap="sm" marginInlineEnd="lg">
              <MonoRedo /> 1
            </Stack>
          </SelectItem>
        </Select> */}
      </Stack>
    </Stack>
  );
};

export default TablePagination;
