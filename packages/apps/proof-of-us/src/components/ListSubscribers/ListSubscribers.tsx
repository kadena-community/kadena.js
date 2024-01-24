import { useAccount } from '@/hooks/account';
import { useSocket } from '@/hooks/socket';
import { useParams } from 'next/navigation';
import type { FC } from 'react';

export const ListSubscribers: FC = () => {
  const { id: tokenId } = useParams();
  const { proofOfUs, isInitiator, removeSignee } = useSocket();
  const { account } = useAccount();

  return (
    <section>
      <h3>Subscribers</h3>
      <ul>
        {proofOfUs?.signees.map((signee) => (
          <li key={signee.key}>
            {signee.name}

            {isInitiator() && account?.caccount !== signee.key ? (
              <button
                onClick={() =>
                  removeSignee({ tokenId: tokenId.toString(), signee })
                }
              >
                delete
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
};
