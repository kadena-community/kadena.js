'use client';
import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { SocialShare } from '@/components/SocialShare/SocialShare';
import { useGetEventToken } from '@/hooks/data/getEventToken';
import { useParams } from 'next/navigation';
import type { FC } from 'react';

export const Share: FC = () => {
  const params = useParams();

  const { data, isLoading, error } = useGetEventToken(params.id);

  return (
    <div>
      {isLoading && <div>...is loading</div>}
      {error && <div>...error</div>}

      {data && (
        <>
          <SocialShare token={data} />
          <AttendanceTicket token={data} />
        </>
      )}

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
