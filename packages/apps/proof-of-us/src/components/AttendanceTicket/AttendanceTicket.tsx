import type { FC } from 'react';
import { ticketClass } from './style.css';

interface IProps {
  token: IProofOfUsToken;
}

export const AttendanceTicket: FC<IProps> = ({ token }) => {
  const date = new Date(token.properties.date);
  return (
    <section
      className={ticketClass}
      style={{
        backgroundImage: `url("${token.image}")`,
        backgroundColor: token.properties.avatar?.backgroundColor,
        color: token.properties.avatar?.color,
      }}
    >
      <h4>{token.name}</h4>

      <div>
        <h5>Date</h5>
        {date.toLocaleDateString()}
      </div>
    </section>
  );
};
