'use client';
import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { SocialShare } from '@/components/SocialShare/SocialShare';
import { useGetAttendanceToken } from '@/hooks/data/getAttendanceToken';
import { useParams } from 'next/navigation';
import type { FC } from 'react';

export const Share: FC = () => {
  const params = useParams();

  const { data, isLoading, error, token } = useGetAttendanceToken(params?.id);

  return (
    <div>
      {isLoading && <div>...is loading</div>}
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
