'use client';
import type { Token } from '@/__generated__/sdk';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { Stack } from '@kadena/react-ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react';
import useSWR from 'swr';
import { IsLoading } from '../IsLoading/IsLoading';
import { AttendanceThumb } from '../Thumb/AttendanceThumb';
import { ConnectThumb } from '../Thumb/ConnectThumb';
import { Text } from '../Typography/Text';
import { listItemClass, listItemLinkClass } from './style.css';

interface IProps {
  token: Token;
}

interface ITempToken extends Token {
  info: {
    precision: number;
    uri: string;
    supply: number;
  };
}

export const ListItem: FC<IProps> = ({ token }) => {
  //@todo fix the tokenURI. it is now missing from the graph
  const uri = (token as ITempToken).info?.uri;
  const { data, isLoading } = useSWR(uri, fetchManifestData, {
    revalidateOnFocus: false,
  });

  return (
    <motion.li
      className={listItemClass}
      initial={{ opacity: 0, left: '500px' }}
      animate={{ opacity: 1, left: 0 }}
      exit={{ opacity: 0, left: '500px' }}
    >
      {isLoading && <IsLoading />}
      {data && (
        <Link
          className={listItemLinkClass}
          href={`/user/proof-of-us/t/${token.id}`}
        >
          {data.properties.eventType === 'attendance' && (
            <AttendanceThumb token={data} />
          )}
          {data.properties.eventType === 'connect' && (
            <ConnectThumb token={data} />
          )}
          <Stack display="flex" flexDirection="column" gap="xs">
            <Text transform="capitalize" bold>
              {data.name}
            </Text>
            <Text variant="small">
              {data.properties.eventName ??
                new Date(data.properties.date).toDateString()}
            </Text>
          </Stack>
        </Link>
      )}
    </motion.li>
  );
};
