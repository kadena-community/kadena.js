'use client';

import { useTokens } from '@/hooks/tokens';
import { createManifest } from '@/utils/createManifest';
import { fetchManifestData } from '@/utils/fetchManifestData';
import { store } from '@/utils/socket/store';
import { Stack } from '@kadena/react-ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { IsLoading } from '../IsLoading/IsLoading';
import { AttendanceThumb } from '../Thumb/AttendanceThumb';
import { ConnectThumb } from '../Thumb/ConnectThumb';
import { Text } from '../Typography/Text';
import { listItemClass, listItemLinkClass } from './style.css';

interface IProps {
  token?: IToken;
}

export const ListItem: FC<IProps> = ({ token }) => {
  const [uri, setUri] = useState<string | undefined>();
  const { data, error } = useSWR(uri ? uri : null, fetchManifestData, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const [innerData, setInnerData] = useState<IProofOfUsTokenMeta | undefined>();
  const [isMinted, setIsMinted] = useState(true);
  const { removeTokenFromData } = useTokens();

  const loadProofOfUsData = useCallback(async (proofOfUsId: string) => {
    const data = await store.getProofOfUs(proofOfUsId);
    if (!data) return;
    const metaData = await createManifest(data, data?.imageUri);

    setInnerData(metaData);
  }, []);

  const loadData = useCallback(
    async (data: IProofOfUsTokenMeta | undefined) => {
      if (!data) return;
      if (token) {
        setInnerData(data);
      }
    },
    [],
  );

  useEffect(() => {
    if (!token || !error) return;
    removeTokenFromData(token);
  }, [error, token, removeTokenFromData]);

  useEffect(() => {
    setIsMinted(false);
    if (token?.listener) {
      token.listener.then((res) => {
        setIsMinted(true);
      });
    } else {
      setIsMinted(true);
    }
  }, [token, setIsMinted]);

  useEffect(() => {
    if (data) {
      loadData(data);
      return;
    }

    if (token?.proofOfUsId) {
      loadProofOfUsData(token?.proofOfUsId);
      return;
    }
  }, [data, token]);

  useEffect(() => {
    if (token?.info?.uri) {
      setUri(token.info.uri);
      return;
    }
  }, [token]);

  const link = useMemo(() => {
    if (innerData?.properties.eventType === 'attendance') {
      if (isMinted) {
        return `/user/proof-of-us/t/${token?.id}`;
      }
      return `/scan/e/${token?.eventId}`;
    }

    if (isMinted) {
      return `/user/proof-of-us/t/${token?.id}`;
    } else {
      return `/user/proof-of-us/t/${token?.id}/${token?.requestKey}`;
    }
  }, [
    isMinted,
    token?.id,
    token?.requestKey,
    innerData?.properties.eventType,
    token?.eventId,
  ]);

  return (
    <motion.li
      className={listItemClass}
      initial={{ opacity: 0, left: '500px' }}
      animate={{ opacity: 1, left: 0 }}
      exit={{ opacity: 0, left: '500px' }}
    >
      {!innerData ? (
        <IsLoading />
      ) : (
        <Link className={listItemLinkClass} href={link}>
          {innerData.properties.eventType === 'attendance' && (
            <AttendanceThumb token={innerData} isMinted={isMinted} />
          )}

          {innerData.properties.eventType === 'connect' && (
            <ConnectThumb token={innerData} isMinted={isMinted} />
          )}

          <Stack display="flex" flexDirection="column" gap="xs">
            <Text transform="capitalize" bold>
              {innerData.name}
            </Text>
            <Text variant="small">
              {new Date(innerData.properties.date).toDateString()}
            </Text>
          </Stack>
        </Link>
      )}
    </motion.li>
  );
};
