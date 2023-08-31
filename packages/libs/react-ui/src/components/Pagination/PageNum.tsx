import { pageNumButtonClass } from './Pagination.css';

import classNames from 'classnames';
import React, { type FC } from 'react';

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
