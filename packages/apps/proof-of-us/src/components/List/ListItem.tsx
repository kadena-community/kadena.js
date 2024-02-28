'use client';
import type { Token } from '@/__generated__/sdk';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { Stack } from '@kadena/react-ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { IsLoading } from '../IsLoading/IsLoading';
import { AttendanceThumb } from '../Thumb/AttendanceThumb';
import { ConnectThumb } from '../Thumb/ConnectThumb';
import { Text } from '../Typography/Text';
import { listItemClass, listItemLinkClass } from './style.css';

interface IProps {
  token?: Token;
  proofOfUsData?: IProofOfUsTokenMetaWithkey;
}

export const ListItem: FC<IProps> = ({ token, proofOfUsData }) => {
  const [uri, setUri] = useState<string | undefined>();
  const { data } = useSWR(uri ? uri : null, fetchManifestData, {
    revalidateOnFocus: false,
  });
  const [innerData, setInnerData] = useState<IProofOfUsTokenMeta | undefined>();

  useEffect(() => {
    if (token) {
      setUri(token.info?.uri);
      return;
    }
  }, [token]);

  const loadData = useCallback(
    async (
      data: IProofOfUsTokenMeta | undefined,
      proofOfUsData: IProofOfUsTokenMeta | undefined,
    ) => {
      if (proofOfUsData && 'properties' in proofOfUsData) {
        setInnerData(proofOfUsData);
      } else {
        setInnerData(data);
      }
    },
    [],
  );

  useEffect(() => {
    loadData(data, proofOfUsData);
  }, [data, proofOfUsData, loadData]);

  const getLink = () => {
    if (!proofOfUsData) return `/user/proof-of-us/t/${token?.id}`;

    if (!proofOfUsData.tokenId) {
      return `/scan/e/${proofOfUsData.properties.eventId}`;
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
      {!innerData && <IsLoading />}
      {innerData && (
        <Link className={listItemLinkClass} href={getLink()}>
          {innerData.properties.eventType === 'attendance' && (
            <AttendanceThumb
              token={innerData}
              isMinted={
                proofOfUsData?.mintStatus === 'success' ||
                proofOfUsData?.mintStatus === undefined
              }
            />
          )}
          {innerData.properties.eventType === 'connect' && (
            <ConnectThumb
              token={innerData}
              isMinted={
                proofOfUsData?.mintStatus === 'success' ||
                proofOfUsData?.mintStatus === undefined
              }
            />
          )}
          <Stack display="flex" flexDirection="column" gap="xs">
            <Text transform="capitalize" bold>
              {innerData.name}
            </Text>
            <Text variant="small">
              {innerData.properties.eventName ??
                new Date(innerData.properties.date).toDateString()}
            </Text>
          </Stack>
        </Link>
      )}
    </motion.li>
  );
};
