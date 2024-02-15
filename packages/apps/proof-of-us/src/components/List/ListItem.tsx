import { fetchManifestData } from '@/utils/fetchManifestData';
import Link from 'next/link';
import type { FC } from 'react';
import useSWR from 'swr';
import { IsLoading } from '../IsLoading/IsLoading';
import { EventThumb } from '../Thumb/EventThumb';
import { MultiThumb } from '../Thumb/MultiThumb';
import {
  listItemClass,
  listItemLinkClass,
  timeClass,
  titleClass,
} from './style.css';

interface IProps {
  token: IProofOfUsToken;
}

export const ListItem: FC<IProps> = ({ token }) => {
  const { data, isLoading } = useSWR(token.uri, fetchManifestData, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
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
          {data.properties.eventType === 'multi' && <MultiThumb token={data} />}
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
