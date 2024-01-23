'use client';
import { ListSubscribers } from '@/components/ListSubscribers/ListSubscribers';
import { useSocket } from '@/hooks/socket';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const { addSignee, removeSignee, isConnected, connect } = useSocket();

  const handleJoin = async () => {
    addSignee({ tokenId: params.id });
  };

  const handleRemove = async () => {
    removeSignee({ tokenId: params.id });
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
