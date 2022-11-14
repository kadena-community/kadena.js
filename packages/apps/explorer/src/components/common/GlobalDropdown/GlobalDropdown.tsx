import s from './GlobalDropdown.module.css';

import React, { FC, memo, ReactNode, useEffect } from 'react';

interface IProps {
  children: ReactNode;
  setOpenedTab: (bool: string) => void;
}

const GlobalDropdown: FC<IProps> = ({ children, setOpenedTab }) => {
  useEffect(() => {
    window.addEventListener('click', () => {
      setOpenedTab('');
      document.body.style.overflowY = 'initial';
    });
    return () => {
      window.removeEventListener('click', () => {
        setOpenedTab('');
        document.body.style.overflowY = 'initial';
      });
    };
  }, [setOpenedTab]);
  return <div className={s.dropdown}>{children}</div>;
};

export default memo(GlobalDropdown);
