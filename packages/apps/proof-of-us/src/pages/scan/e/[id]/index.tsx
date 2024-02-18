import { MainLoader } from '@/components/MainLoader/MainLoader';
import ScanLayout from '@/components/ScanLayout/ScanLayout';
import { ScanAttendanceEvent } from '@/features/ScanAttendanceEvent/ScanAttendanceEvent';
import { useGetAttendanceToken } from '@/hooks/data/getAttendanceToken';
import { useHasMintedAttendaceToken } from '@/hooks/data/hasMintedAttendaceToken';
import type { NextPage, NextPageContext } from 'next';
import { useEffect, useState } from 'react';

interface IProps {
  params: {
    id: string;
    transaction: string;
  };
}
const Page: NextPage<IProps> = ({ params }) => {
  const eventId = decodeURIComponent(params.id);
  const { data, isLoading, error } = useGetAttendanceToken(eventId);
  const [isMinted, setIsMinted] = useState(false);

  const { hasMinted } = useHasMintedAttendaceToken();

  const init = async () => {
    const result = await hasMinted(eventId);
    setIsMinted(result);
  };

  useEffect(() => {
    init();
  }, []);

  if (!data) return null;

  return (
    <ScanLayout>
      <div>
        {isLoading && <MainLoader />}
        {error && <div>...error</div>}
        <ScanAttendanceEvent
          token={data}
          eventId={eventId}
          isMinted={isMinted}
        />
      </div>
    </ScanLayout>
  );
};

export const getServerSideProps = async (
  ctx: NextPageContext,
): Promise<IProps> => {
  return {
    params: { id: `${ctx.query.id}`, transaction: `${ctx.query.transaction}` },
  };
};

export default Page;
