'use client';

import { Stack } from '@kadena/react-ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react';
import { AttendanceThumb } from '../Thumb/AttendanceThumb';
import { ConnectThumb } from '../Thumb/ConnectThumb';
import { Text } from '../Typography/Text';
import { listItemClass, listItemLinkClass } from './style.css';

interface IProps {
  proofOfUsData?: IProofOfUsData;
}

export const ListItem: FC<IProps> = ({ proofOfUsData }) => {
  if (!proofOfUsData) return null;

  const getLink = () => {
    if (proofOfUsData?.mintStatus === 'success') {
      if (proofOfUsData.type === 'attendance')
        return `/user/proof-of-us/t/${proofOfUsData.tokenId}`;
      if (proofOfUsData.type === 'connect')
        return `/user/proof-of-us/t/${proofOfUsData.tokenId}/${proofOfUsData.requestKey}`;
    }

    if (!proofOfUsData.tokenId) {
      return `/scan/e/${proofOfUsData.eventId}`;
    } else {
      return `/user/proof-of-us/t/${proofOfUsData.tokenId}/${proofOfUsData.requestKey}`;
    }
  };

  return (
    <motion.li
      className={listItemClass}
      initial={{ opacity: 0, left: '500px' }}
      animate={{ opacity: 1, left: 0 }}
      exit={{ opacity: 0, left: '500px' }}
    >
      {proofOfUsData && (
        <Link className={listItemLinkClass} href={getLink()}>
          {proofOfUsData.type === 'attendance' && (
            <AttendanceThumb
              token={proofOfUsData}
              isMinted={
                proofOfUsData?.mintStatus === 'success' ||
                proofOfUsData?.mintStatus === undefined
              }
            />
          )}

          {proofOfUsData.type === 'connect' && (
            <ConnectThumb
              token={proofOfUsData}
              isMinted={
                proofOfUsData?.mintStatus === 'success' ||
                proofOfUsData?.mintStatus === undefined
              }
            />
          )}

          <Stack display="flex" flexDirection="column" gap="xs">
            <Text transform="capitalize" bold>
              {proofOfUsData.title}
            </Text>
            <Text variant="small">
              {new Date(proofOfUsData.date).toDateString()}
            </Text>
          </Stack>
        </Link>
      )}
    </motion.li>
  );
};
