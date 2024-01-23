'use client';
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
  const { connect, socket } = useSocket();
  const { account } = useAccount();

  useEffect(() => {
    connect(params.id);
  }, []);

  const handleJoin = () => {
    if (!socket) return;
    socket.emit('private message', {
      content: account?.publicKey,
      to: 'TOKENID2',
    });
  };

  return (
    <div>
      <section>
        <button onClick={handleJoin}>say hello!</button>
      </section>
      scanned Proof Of Us with ID ({params.id})<section></section>
    </div>
  );
};

export default Page;
