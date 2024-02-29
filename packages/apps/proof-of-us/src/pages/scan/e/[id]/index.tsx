import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import UserLayout from '@/components/UserLayout/UserLayout';
import { ScanAttendanceEvent } from '@/features/ScanAttendanceEvent/ScanAttendanceEvent';
import { useAccount } from '@/hooks/account';
import { useHasMintedAttendaceToken } from '@/hooks/data/hasMintedAttendaceToken';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { getImageString } from '@/utils/getImageString';
import { getProofOfUs } from '@/utils/proofOfUs';
import type { NextPage, NextPageContext } from 'next';
import { useEffect, useState } from 'react';

interface IProps {
  params: {
    id: string;
    transaction: string;
  };
  data?: IProofOfUsTokenMeta;
  image: string;
}
const Page: NextPage<IProps> = ({ params, data, image }) => {
  const eventId = decodeURIComponent(params.id);
  //const { data, isLoading, error } = useGetAttendanceToken(eventId);
  const { account } = useAccount();
  const [isMinted, setIsMinted] = useState(false);

  const { hasMinted } = useHasMintedAttendaceToken();

  const init = async () => {
    const result = await hasMinted(eventId, account?.accountName);
    setIsMinted(result);
  };

  useEffect(() => {
    init();
  }, [account]);

  if (!data) return null;

  return (
    <UserLayout>
      <ScreenHeight>
        <TitleHeader label="Attendance @" />

        <ScanAttendanceEvent
          data={data}
          eventId={eventId}
          isMinted={isMinted}
          handleIsMinted={setIsMinted}
          image={image}
        />
      </ScreenHeight>
    </UserLayout>
  );
};

export const getServerSideProps = async (
  ctx: NextPageContext,
): Promise<{ props: IProps }> => {
  const eventId = decodeURIComponent(`${ctx.query.id}`);
  const token = await getProofOfUs(eventId);

  const data = await fetchManifestData(token?.uri);

  const startDate = token && token['starts-at'].int;
  const endDate = token && token['ends-at'].int;

  const newData = data
    ? { ...data, startDate, endDate, manifestUri: token?.uri }
    : undefined;

  //image
  const base64_body = await getImageString(data?.image);

  return {
    props: {
      params: {
        id: `${ctx.query.id}`,
        transaction: `${ctx.query.transaction}`,
      },
      data: newData,
      image: base64_body,
    },
  };
};

export default Page;
