'use client';
import { useAccount } from '@/hooks/account';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { Socket } from 'Socket.IO-client';
import io from 'Socket.IO-client';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const [socket, setSocket] = useState<Socket>();
  const { account } = useAccount();

  const socketInitializer = async () => {
    await fetch('/api/socket');
    const sock = io({ autoConnect: false });

    setSocket(sock);
    sock.auth = { tokenId: 'TOKENID2' };
    sock.connect();

    sock.on('connect', () => {
      sock.send('test');

      console.log('connected');
    });

    sock.onAny((event, ...args) => {
      console.log(event, args);
    });
  };

  useEffect(() => {
    socketInitializer();
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
