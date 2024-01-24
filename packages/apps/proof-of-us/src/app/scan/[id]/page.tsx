'use client';
import { ListSubscribers } from '@/components/ListSubscribers/ListSubscribers';
import { useAccount } from '@/hooks/account';
import { useSocket } from '@/hooks/socket';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const { addSignee, removeSignee, isConnected, connect, getSigneeAccount } =
    useSocket();
  const { account } = useAccount();

  const handleJoin = async () => {
    addSignee({ tokenId: params.id });
  };

  const handleRemove = async () => {
    if (!account) return;
    removeSignee({ tokenId: params.id, signee: getSigneeAccount(account) });
  };

  useEffect(() => {
    connect({ tokenId: params.id });
  }, []);

  return (
    <div>
      <section>
        {!isConnected() ? (
          <button onClick={handleJoin}>join</button>
        ) : (
          <button onClick={handleRemove}>remove</button>
        )}
      </section>
      scanned Proof Of Us with ID ({params.id})
      <ListSubscribers />
    </div>
  );
};

export default Page;
