import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { buttonClass } from '../styles.css';

const PaginationButton: FC<PropsWithChildren> = ({ children }) => {
  return <button className={buttonClass}>{children}</button>;
};

export default PaginationButton;
