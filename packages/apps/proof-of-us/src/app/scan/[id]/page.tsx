'use client';
import { AvatarEditor } from '@/components/AvatarEditor/AvatarEditor';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSocket } from '@/hooks/socket';
import type { FC } from 'react';
import { useEffect } from 'react';

interface IProps {
  params: {
    id: string;
  };
}

const Page: FC<IProps> = ({ params }) => {
  const { connect } = useSocket();
  const { addSignee, removeSignee, getSigneeAccount, isConnected } =
    useProofOfUs();
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
      <AvatarEditor />
      scanned Proof Of Us with ID ({params.id})
      <ListSignees />
    </div>
  );
};

export default Page;
