import type { FC } from 'react';
import React from 'react';
import { Button } from '../Button';
import { pageNumButtonClass } from './Pagination.css';

interface IPageNumProps {
  number: number;
  current: boolean;
  onClick: () => void;
}

export const PageNum: FC<IPageNumProps> = ({ number, current, onClick }) => {
  return (
    <Button
      variant="transparent"
      className={pageNumButtonClass}
      data-current={current || undefined}
      aria-current={current || undefined}
      onPress={onClick}
    >
      {number}
    </Button>
  );
};
