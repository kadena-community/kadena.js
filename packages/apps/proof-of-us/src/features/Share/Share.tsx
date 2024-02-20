'use client';
import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { IconButton } from '@/components/IconButton/IconButton';
import { SocialShare } from '@/components/SocialShare/SocialShare';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import UserLayout from '@/components/UserLayout/UserLayout';
import { env } from '@/utils/env';
import { MonoClose } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/navigation';

import type { FC } from 'react';

interface IProps {
  tokenId: string;
  data?: IProofOfUsTokenMeta;
}
export const Share: FC<IProps> = ({ tokenId, data }) => {
  const router = useRouter();

  if (!data) return null;

  const handleClose = () => {
    router.push('/user');
  };
  return (
    <UserLayout>
      <TitleHeader
        label={data.name}
        Append={() => (
          <>
            <SocialShare data={data} tokenId={tokenId} />
            <IconButton onClick={handleClose}>
              <MonoClose />
            </IconButton>
          </>
        )}
      />
      <AttendanceTicket data={data} />
      <Stack>
        find your token on the chain:{' '}
        <a
          href={`https://explorer.chainweb.com/${env.NETWORKNAME}/eventsearch?q=${tokenId}`}
          target="_blank"
        >
          click here
        </a>
      </Stack>
    </UserLayout>
  );
};
