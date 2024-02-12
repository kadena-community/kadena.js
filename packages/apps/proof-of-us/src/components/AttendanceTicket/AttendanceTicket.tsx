import type { FC } from 'react';
import { ticketClass } from './style.css';

interface IProps {
  token: IProofOfUsToken;
}

export const AttendanceTicket: FC<IProps> = ({ token }) => {
  const date = new Date(token.properties.date);
  return (
    <>
      <svg viewBox="0 0 160 90" width="1">
        <defs>
          <clipPath id="path" clipPathUnits="objectBoundingBox">
            <path
              style={{ fill: 'rgb(0,7,255)' }}
              transform="scale(0.0063, 0.011)"
              d="M159.764,30.921c-0.029,0 -0.059,0 -0.088,0c-7.771,0 -14.079,6.309 -14.079,14.079c-0,7.77 6.308,14.079 14.079,14.079c0.029,-0 0.059,-0 0.088,-0l0,31.008l-159.642,0l-0,-89.817l159.642,0l0,30.651Z"
            ></path>
          </clipPath>
        </defs>
      </svg>
      <section
        className={ticketClass}
        style={{
          backgroundImage: `url("${token.image}")`,
          backgroundColor: token.properties.avatar?.backgroundColor,
        }}
      >
        <h4>{token.name}</h4>

        <div>
          <h5>Date</h5>
          {date.toLocaleDateString()}
        </div>
      </section>
    </>
  );
};
