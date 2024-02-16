import { fetchManifestData } from '@/utils/fetchManifestData';

import type { Token } from '@/__generated__/sdk';
import Link from 'next/link';
import type { FC } from 'react';
import useSWR from 'swr';
import { IsLoading } from '../IsLoading/IsLoading';
import { ConnectThumb } from '../Thumb/ConnectThumb';
import { EventThumb } from '../Thumb/EventThumb';
import {
  listItemClass,
  listItemLinkClass,
  timeClass,
  titleClass,
} from './style.css';

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
  const uri =
    (token as ITempToken).info?.uri ??
    'https://bafybeiemmkua6swmnvx4toqnhhmqavqkm4z5zltkiuj4yuq3kwnm576esq.ipfs.nftstorage.link/metadata';
  const { data, isLoading } = useSWR(uri, fetchManifestData, {
    revalidateOnFocus: false,
  });

  return (
    <li className={listItemClass}>
      {isLoading && <IsLoading />}
      {data && (
        <Link
          className={listItemLinkClass}
          href={`/user/proof-of-us/t/${data.properties.eventId}`}
        >
          {data.properties.eventType === 'attendance' && (
            <EventThumb token={data} />
          )}
          {data.properties.eventType === 'connect' && (
            <ConnectThumb token={data} />
          )}
          <span className={titleClass}>{data.name}</span>
          <time
            className={timeClass}
            dateTime={new Date(data.properties.date).toLocaleDateString()}
          >
            {new Date(data.properties.date).toLocaleDateString()}
          </time>
        </Link>
      )}
    </li>
  );
};
