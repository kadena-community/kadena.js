'use client';

import { ScanAttendanceEvent } from '@/features/ScanAttendanceEvent/ScanAttendanceEvent';
import { useGetEventToken } from '@/hooks/data/getEventToken';
import { useHasMintedAttendaceToken } from '@/hooks/data/hasMintedAttendaceToken';

import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface IProps {
  params: {
    id: string;
    transaction: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const eventId = decodeURIComponent(params.id);
  const { data, isLoading, error } = useGetEventToken(eventId);
  const [isMinted, setIsMinted] = useState(false);

  const { hasMinted } = useHasMintedAttendaceToken();

  const init = async () => {
    const result = await hasMinted(eventId);
  };

  useEffect(() => {
    init();
  }, []);

  if (!data) return null;

  return (
    <div>
      {isLoading && <div>...is loading</div>}
      {error && <div>...error</div>}
      <ScanAttendanceEvent token={data} eventId={eventId} />
    </div>
  );
};

export default Page;
