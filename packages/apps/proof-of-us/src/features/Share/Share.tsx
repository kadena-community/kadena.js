'use client';
import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { SocialShare } from '@/components/SocialShare/SocialShare';
import { env } from '@/utils/env';

import type { FC } from 'react';

interface IProps {
  tokenId: string;
  data?: IProofOfUsTokenMeta;
}
export const Share: FC<IProps> = ({ tokenId, data }) => {
  if (!data) return null;
  return (
    <div>
      {data.name && (
        <>
          <SocialShare data={data} tokenId={tokenId} />
          <AttendanceTicket data={data} />
        </>
      )}

      <div>
        find your token on the chain:{' '}
        <a
          href={`https://explorer.chainweb.com/${env.NETWORKNAME}/eventsearch?q=${tokenId}`}
          target="_blank"
        >
          click here
        </a>
      </div>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
