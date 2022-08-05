import React, { FC, memo } from 'react';
import { NextRouter } from 'next/router';
import s from './Icon.module.css';

interface IProps {
  router: NextRouter;
}

const Coin: FC<IProps> = ({ router }) => {
  return (
    <div onClick={() => router.push('/coin')} className={s.iconContainer}>
      <svg
        width="22"
        height="16"
        viewBox="0 0 22 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 0C9.58 0 6 3.58 6 8C6 12.42 9.58 16 14 16C18.42 16 22 12.42 22 8C22 3.58 18.42 0 14 0ZM14 14C10.69 14 8 11.31 8 8C8 4.69 10.69 2 14 2C17.31 2 20 4.69 20 8C20 11.31 17.31 14 14 14ZM2 8C2 5.61 3.4 3.54 5.43 2.58C5.77 2.42 6 2.11 6 1.74V1.55C6 0.87 5.29 0.44 4.68 0.73C1.92 1.99 0 4.77 0 8C0 11.23 1.92 14.01 4.68 15.27C5.29 15.55 6 15.13 6 14.45V14.27C6 13.9 5.77 13.58 5.43 13.42C3.4 12.46 2 10.39 2 8Z"
          fill="#ED098F"
        />
      </svg>
    </div>
  );
};

export default memo(Coin);
