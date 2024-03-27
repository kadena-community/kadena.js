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
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

import type { FC } from 'react';

interface IProps {
  tokenId: string;
  data?: IProofOfUsTokenMeta;
  metadataUri?: string;
}

export const AttendanceShare: FC<IProps> = ({ tokenId, data, metadataUri }) => {
  const router = useRouter();

  if (!data) return null;

  const handleClose = () => {
    router.push('/user');
  };
  return (
    <UserLayout>
      <Stack paddingInline="md" flexDirection="column">
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
        <Stack flexDirection="column" marginBlockStart="lg">
          <Heading as="h4">Metadata</Heading>
          <MetaList>
            <MetaTerm>block explorer</MetaTerm>
            <MetaDetails>
              <a
                href={`https://explorer.chainweb.com/${env.NETWORKNAME}/eventsearch?q=${tokenId}`}
                target="_blank"
              >
                click here
              </a>
            </MetaDetails>

            <MetaTerm>name</MetaTerm>
            <MetaDetails>{data.name}</MetaDetails>
            <MetaTerm>description</MetaTerm>
            <MetaDetails>{data.description}</MetaDetails>

            <MetaTerm>event Date</MetaTerm>
            <MetaDetails>
              {format(data.properties.date, 'dd MMMM yyyy')}
            </MetaDetails>
            <MetaTerm>image</MetaTerm>
            <MetaDetails>
              <a href={data.image} target="_blank">
                click here
              </a>
            </MetaDetails>
            {metadataUri && (
              <>
                <MetaTerm>all meta data</MetaTerm>
                <MetaDetails>
                  <a href={metadataUri} target="_blank">
                    click here
                  </a>
                </MetaDetails>
              </>
            )}
          </MetaList>
        </Stack>
      </Stack>
    </UserLayout>
  );
};
