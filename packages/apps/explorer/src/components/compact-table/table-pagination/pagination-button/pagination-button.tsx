import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { buttonClass, disabledClass } from '../styles.css';

const PaginationButton: FC<
  PropsWithChildren<{
    onClick: () => void;
    isDisabled: boolean;
  }>
> = ({ children, onClick, isDisabled }) => {
  return (
    <button
      disabled={isDisabled}
      className={classNames(buttonClass, { [disabledClass]: isDisabled })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PaginationButton;
