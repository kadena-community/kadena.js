import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { pageNumButtonClass } from './Pagination.css';

interface IPageNumProps {
  number: number;
  current: boolean;
  onClick: () => void;
}

export const PageNum: FC<IPageNumProps> = ({ number, current, onClick }) => {
  return (
    <button
      className={classNames(pageNumButtonClass, { current })}
      onClick={onClick}
    >
      {number}
    </button>
  );
};
