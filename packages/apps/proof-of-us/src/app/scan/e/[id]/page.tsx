'use client';

import { ScanAttendanceEvent } from '@/features/ScanAttendanceEvent/ScanAttendanceEvent';
import { useGetEventToken } from '@/hooks/data/getEventToken';

import type { FC } from 'react';

interface IProps {
  params: {
    id: string;
    transaction: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const eventId = decodeURIComponent(params.id);

  // const transactionInit = async () => {
  //   const client = createClient();

  //   const transactionParam = searchParams.transaction;
  //   const transactionParamData = transactionParam
  //     ? Buffer.from(transactionParam, 'base64').toString()
  //     : null;

  //   const tx = JSON.parse(transactionParamData ?? '{}');
  //   const txData = JSON.parse(tx.cmd || '{}');

  //   const result = await client.local(tx);

  //   console.log('resulthere:', result);
  // };

  // useEffect(() => {
  //   transactionInit();
  // }, [searchParams.transaction]);

  const { data, isLoading, error } = useGetEventToken(eventId);
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
