'use client';
import type { Token } from '@/__generated__/sdk';
import { FloatButton } from '@/components/FloatButton/FloatButton';
import { List } from '@/components/List/List';
import { ListItem } from '@/components/List/ListItem';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import UserLayout from '@/components/UserLayout/UserLayout';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import { centerClass, emptyListLinkClass } from '@/styles/global.css';
import { SystemIcon } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC } from 'react';

const Page: FC = () => {
  const { data, isLoading, error } = useGetAllProofOfUs();

  return (
    <UserLayout>
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
    </UserLayout>
  );
};

export default Page;
