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
  token: IProofOfUsToken;
}

export const ListItem: FC<IProps> = ({ token }) => {
  return (
    <li className={listItemClass}>
      <Link
        className={listItemLinkClass}
        href={`/user/proof-of-us/t/${token.tokenId}`}
      >
        {token.properties.type === 'event' && <EventThumb token={token} />}
        {token.properties.type === 'multi' && <MultiThumb token={token} />}
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
