import styles from './code.module.scss';

import React, { FC, ReactNode } from 'react'

interface ICodeProps {
  children: ReactNode;
  color?: string;
}

export const Code: FC<ICodeProps> = ({ children, color }) =>  {
  return (
    <div className={`${styles['code-block']} ${color? styles[`${color}`] : ''}`}>
      {children}
    </div>
  );
};