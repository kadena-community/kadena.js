'use client';

import type { Token } from '@/__generated__/sdk';
import { useTokens } from '@/hooks/tokens';
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
  proofOfUsData?: IProofOfUsData;
  token?: IToken;
}

export const ListItem: FC<IProps> = ({ proofOfUsData, token }) => {
  const [uri, setUri] = useState<string | undefined>();
  const { data, isLoading, error } = useSWR(
    uri ? uri : null,
    fetchManifestData,
    {
      revalidateOnFocus: false,
    },
  );
  const [innerData, setInnerData] = useState<IProofOfUsTokenMeta | undefined>();
  const [innerTokenId, setInnerTokenId] = useState<string>();
  const { removeTokenFromData } = useTokens();

  useEffect(() => {
    if (token) {
      setUri(token.uri);
      return;
    }
  }, [token]);

  const loadData = useCallback(
    async (
      data: IProofOfUsTokenMeta | undefined,
      proofOfUsData: IProofOfUsData | undefined,
    ) => {
      if (proofOfUsData && 'signees' in proofOfUsData) {
        // const manifestData = await createManifest(
        //   proofOfUsData,
        //   proofOfUsData?.imageUri,
        // );
        // setInnerData(manifestData);
      } else if (token) {
        setInnerData(data);
        setInnerTokenId(token.tokenId);
      }
    },
    [],
  );

  useEffect(() => {
    if (!token || !error) return;
    console.log('error', { error });
    removeTokenFromData(token);
  }, [error, token, removeTokenFromData]);

  useEffect(() => {
    loadData(data, proofOfUsData);
  }, [data, proofOfUsData, loadData]);

  const getLink = () => {
    //return `/scan/e/${innerData?.properties.eventId}`;
    // if (proofOfUsData?.mintStatus === 'success') {
    //   if (proofOfUsData.type === 'attendance')
    //     return `/user/proof-of-us/t/${proofOfUsData.tokenId}`;
    //   if (proofOfUsData.type === 'connect')
    //     return `/user/proof-of-us/t/${proofOfUsData.tokenId}/${proofOfUsData.requestKey}`;
    // }

    // if (!proofOfUsData.tokenId) {
    // } else {
    //   return `/user/proof-of-us/t/${proofOfUsData.tokenId}/${proofOfUsData.requestKey}`;
    // }

    if (innerData?.properties.eventType === 'attendance') {
      return `/user/proof-of-us/t/${innerTokenId}`;
    } else {
      return `/user/proof-of-us/t/${innerTokenId}`;
    }
  };

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
        <Link className={listItemLinkClass} href={getLink()}>
          {innerData.properties.eventType === 'attendance' && (
            <AttendanceThumb token={innerData} isMinted={true} />
          )}

          {innerData.properties.eventType === 'connect' && (
            <ConnectThumb token={innerData} isMinted={true} />
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
