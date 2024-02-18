'use client';
import { AttendanceTicket } from '@/components/AttendanceTicket/AttendanceTicket';
import { SocialShare } from '@/components/SocialShare/SocialShare';

import type { FC } from 'react';

interface IProps {
  eventId: string;
  token?: IProofOfUsToken;
  proofOfUs?: IProofOfUsTokenMeta;
}
export const Share: FC<IProps> = ({ token, proofOfUs }) => {
  return (
    <div>
      {proofOfUs?.name && (
        <>
          <SocialShare token={proofOfUs} />
          <AttendanceTicket token={proofOfUs} />
        </>
      )}

      {proofOfUs && <pre>{JSON.stringify(proofOfUs, null, 2)}</pre>}
      {token && <pre>{JSON.stringify(token, null, 2)}</pre>}
    </div>
  );
};
