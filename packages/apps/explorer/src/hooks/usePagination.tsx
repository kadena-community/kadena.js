import type { ITablePaginationPageOptions } from '@/components/compact-table/table-pagination/table-pagination';
import { useState } from 'react';

const PAGESIZE = 20;

interface IProps {
  id: string;
  pageSize?: number;
}

export const usePagination = ({ id, pageSize = PAGESIZE }: IProps) => {
  const [paginationLastRecord, setPaginationLastRecord] = useState<
    number | undefined | null
  >(undefined);
  const [paginationBeforeRecord, setPaginationBeforeRecord] = useState<
    string | undefined | null
  >(undefined);
  const [paginationAfterRecord, setPaginationAfterRecord] = useState<
    string | undefined | null
  >(undefined);
  const [paginationFirstRecord, setPaginationFirstRecord] = useState<
    number | undefined | null
  >(PAGESIZE);

  const variables = {
    id,
    first: paginationFirstRecord,
    last: paginationLastRecord,
    before: paginationBeforeRecord,
    after: paginationAfterRecord,
  };

  const handlePageChange = (page: ITablePaginationPageOptions) => {
    setPaginationLastRecord(page.last);
    setPaginationFirstRecord(page.first);
    setPaginationBeforeRecord(page.before);
    setPaginationAfterRecord(page.after);
  };

  return {
    variables,
    handlePageChange,
    pageSize,
  };
};
