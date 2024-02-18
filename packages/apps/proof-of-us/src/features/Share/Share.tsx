'use client';
import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { ticketWrapClass } from '@/components/AttendanceTicket/style.css';

import { MainLoader } from '@/components/MainLoader/MainLoader';
import { SocialShare } from '@/components/SocialShare/SocialShare';
import { useGetAttendanceToken } from '@/hooks/data/getAttendanceToken';
import { motion } from 'framer-motion';
import type { FC } from 'react';

interface IProps {
  eventId: string;
}
export const Share: FC<IProps> = ({ eventId }) => {
  const { data, isLoading, error, token } = useGetAttendanceToken(eventId);

  return (
    <div>
      {isLoading && (
        <div>
          <MainLoader />
          <motion.div className={ticketWrapClass} layoutId={`${eventId}`} />
        </div>
      )}
      {error && <div>...error</div>}

      {data?.name && (
        <>
          <SocialShare token={data} />
          <AttendanceTicket token={data} />
        </>
      )}

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {token && <pre>{JSON.stringify(token, null, 2)}</pre>}
    </div>
  );
};
