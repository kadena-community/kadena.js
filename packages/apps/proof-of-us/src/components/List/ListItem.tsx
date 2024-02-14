import Link from 'next/link';
import type { FC } from 'react';
import { EventThumb } from '../Thumb/EventThumb';
import { MultiThumb } from '../Thumb/MultiThumb';
import {
  listItemClass,
  listItemLinkClass,
  timeClass,
  titleClass,
} from './style.css';

interface IProps {
  token: IProofOfUsTokenMeta;
}

export const ListItem: FC<IProps> = ({ token }) => {
  return (
    <li className={listItemClass}>
      <Link
        className={listItemLinkClass}
        href={`/user/proof-of-us/t/${token.properties.eventId}`}
      >
        {token.properties.eventType === 'attendance' && (
          <EventThumb token={token} />
        )}
        {token.properties.eventType === 'multi' && <MultiThumb token={token} />}
        <span className={titleClass}>{token.name}</span>
        <time
          className={timeClass}
          dateTime={new Date(token.properties.date).toLocaleDateString()}
        >
          {new Date(token.properties.date).toLocaleDateString()}
        </time>
      </Link>
    </li>
  );
};
