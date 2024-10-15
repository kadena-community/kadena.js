'use client';
import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { MetaDetails } from '@/components/MetaList/MetaDetails';
import { MetaList } from '@/components/MetaList/MetaList';
import { MetaTerm } from '@/components/MetaList/MetaTerm';
import { ScreenHeight } from '@/components/ScreenHeight/ScreenHeight';
import { SocialShare } from '@/components/SocialShare/SocialShare';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { Heading } from '@/components/Typography/Heading';
import UserLayout from '@/components/UserLayout/UserLayout';
import { env } from '@/utils/env';
import { Stack } from '@kadena/kode-ui';
import { format } from 'date-fns';
import type { FC } from 'react';

interface IProps {
  tokenId: string;
  data?: IProofOfUsTokenMeta;
  metadataUri?: string;
}

export const AttendanceShare: FC<IProps> = ({ tokenId, data, metadataUri }) => {
  if (!data) return null;

  return (
    <UserLayout>
      <ScreenHeight>
        <Stack paddingInline={{ md: 'xxl' }}>
          <TitleHeader
            label={data.name}
            Append={() => (
              <>
                <SocialShare data={data} tokenId={tokenId} />
              </>
            )}
          />
        </Stack>
        <AttendanceTicket data={data} share />
        <Stack paddingInline="md" flexDirection="column">
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
      </ScreenHeight>
    </UserLayout>
  );
};
