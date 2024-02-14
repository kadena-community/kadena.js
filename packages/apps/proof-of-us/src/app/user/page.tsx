'use client';
import { FloatButton } from '@/components/FloatButton/FloatButton';
import { List } from '@/components/List/List';
import { ListItem } from '@/components/List/ListItem';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import type { FC } from 'react';

const Page: FC = () => {
  const { data, isLoading, error } = useGetAllProofOfUs();

  return (
    <div>
      <h2>List of your Proof Of Us</h2>
      {isLoading && <MainLoader />}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        <List>
          {data.map((token) => {
            if (!token) return null;
            return (
              <ListItem key={token.properties.eventId} token={token}></ListItem>
            );
          })}
        </List>
      )}

      <FloatButton href="/user/proof-of-us/new">+</FloatButton>
    </div>
  );
};

export default Page;
