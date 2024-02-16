'use client';
import type { Token } from '@/__generated__/sdk';
import { FloatButton } from '@/components/FloatButton/FloatButton';
import { List } from '@/components/List/List';
import { ListItem } from '@/components/List/ListItem';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import { SystemIcon } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC } from 'react';
import { centerClass, emptyListLinkClass } from './style.css';

const Page: FC = () => {
  const { data, isLoading, error } = useGetAllProofOfUs();

  return (
    <div>
      <h2>List of your Proof Of Us</h2>
      {isLoading && <MainLoader />}
      {error && <div>{error.message}</div>}
      {!isLoading &&
        !error &&
        (data.length === 0 ? (
          <div className={centerClass}>
            <Link className={emptyListLinkClass} href="/user/proof-of-us/new">
              <SystemIcon.Plus size="lg" /> Add your first connection
            </Link>
          </div>
        ) : (
          <List>
            {data.map((token: Token) => (
              <ListItem key={token.id} token={token} />
            ))}
          </List>
        ))}

      <FloatButton href="/user/proof-of-us/new">+</FloatButton>
    </div>
  );
};

export default Page;
