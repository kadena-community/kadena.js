import React, { FC, ReactNode } from 'react';
import Logo from '../Header/components/Logo/Logo';
import s from './Error.module.css';

const Error: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className={s.containerLogo}>
        <div className={s.logo}>
          <Logo />
        </div>
      </div>
      <div className={s.containerText}>
        <h1 className={s.text}>{children}</h1>
      </div>
    </div>
  );
};

export default Error;
