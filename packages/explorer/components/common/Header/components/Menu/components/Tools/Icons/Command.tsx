import React, { FC, memo } from 'react';
import { NextRouter } from 'next/router';
import s from './Icon.module.css';

interface IProps {
  router: NextRouter;
}
const Command: FC<IProps> = ({ router }) => {
  return (
    <div onClick={() => router.push('/command')} className={s.iconContainer}>
      <svg
        width="22"
        height="18"
        viewBox="0 0 20 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.70001 9.89997L2.80001 5.99997L6.70001 2.09997C7.09001 1.70997 7.09001 1.08997 6.70001 0.699971C6.31001 0.309971 5.69001 0.309971 5.30001 0.699971L0.710011 5.28997C0.320011 5.67997 0.320011 6.30997 0.710011 6.69997L5.30001 11.3C5.69001 11.69 6.31001 11.69 6.70001 11.3C7.09001 10.91 7.09001 10.29 6.70001 9.89997ZM13.3 9.89997L17.2 5.99997L13.3 2.09997C12.91 1.70997 12.91 1.08997 13.3 0.699971C13.69 0.309971 14.31 0.309971 14.7 0.699971L19.29 5.28997C19.68 5.67997 19.68 6.30997 19.29 6.69997L14.7 11.3C14.31 11.69 13.69 11.69 13.3 11.3C12.91 10.91 12.91 10.29 13.3 9.89997Z"
          fill="#ED098F"
        />
      </svg>
    </div>
  );
};

export default memo(Command);
