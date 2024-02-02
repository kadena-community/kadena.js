import type { FC } from 'react';
import { ticketClass } from './style.css';

interface IProps {
  title: string;
  timestamp: number;
}

export const AttendanceTicket: FC<IProps> = ({ title, timestamp }) => {
  const date = new Date(timestamp);
  return (
    <section className={ticketClass}>
      <h4>{title}</h4>

      <div>
        <h5>Date</h5>
        {date.toLocaleDateString()}
      </div>
    </section>
  );
};
