import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { tdClass } from './Table.css';

export interface ITdProps {
  children?: React.ReactNode;
  className?: string;
}

export const Td: FC<ITdProps> = ({ children, className }) => {
  return <td className={classNames(tdClass, className)}>{children}</td>;
};
