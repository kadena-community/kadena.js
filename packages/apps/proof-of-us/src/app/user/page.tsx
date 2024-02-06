'use client';
import { FloatButton } from '@/components/FloatButton/FloatButton';
import { IsLoading } from '@/components/IsLoading/IsLoading';
import { List } from '@/components/List/List';
import { ListItem } from '@/components/List/ListItem';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import type { FC } from 'react';

const Page: FC = () => {
  const { data, isLoading, error } = useGetAllProofOfUs();

  return (
    <div>
      <h2>List of your Proof Of Us</h2>
      {isLoading && <IsLoading />}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        <List>
          {data.map(({ token }) => {
            if (!token) return null;
            return <ListItem key={token.tokenId} token={token}></ListItem>;
          })}
        </List>
      )}

      <FloatButton href="/user/proof-of-us/new">+</FloatButton>
    </div>
  );
};

export default Page;
