'use client';
import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { IconButton } from '@/components/IconButton/IconButton';
import { MetaDetails } from '@/components/MetaList/MetaDetails';
import { MetaList } from '@/components/MetaList/MetaList';
import { MetaTerm } from '@/components/MetaList/MetaTerm';
import { SocialShare } from '@/components/SocialShare/SocialShare';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { Heading } from '@/components/Typography/Heading';
import UserLayout from '@/components/UserLayout/UserLayout';
import { env } from '@/utils/env';
import { MonoClose } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/navigation';

import type { FC } from 'react';
import { AttendanceShare } from './AttendanceShare';
import { ConnectShare } from './ConnectShare';

interface IProps {
  tokenId: string;
  data?: IProofOfUsTokenMeta;
  metadataUri?: string;
}
export const Share: FC<IProps> = ({ tokenId, data, metadataUri }) => {
  const router = useRouter();

  if (!data) return null;

  const handleClose = () => {
    router.push('/user');
  };
  return (
    <>
      {data.properties.eventType === 'attendance' && (
        <AttendanceShare
          data={data}
          tokenId={tokenId}
          metadataUri={metadataUri}
        />
      )}
      {data.properties.eventType === 'connect' && (
        <ConnectShare data={data} tokenId={tokenId} metadataUri={metadataUri} />
      )}
    </>
  );
};
