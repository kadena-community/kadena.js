'use client';
import type { FC } from 'react';
import { AttendanceShare } from './AttendanceShare';
import { ConnectShare } from './ConnectShare';

interface IProps {
  tokenId: string;
  data?: IProofOfUsTokenMeta;
  metadataUri?: string;
}
export const Share: FC<IProps> = ({ tokenId, data, metadataUri }) => {
  if (!data) return null;
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
