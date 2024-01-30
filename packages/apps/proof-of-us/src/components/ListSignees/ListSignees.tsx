import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useParams } from 'next/navigation';
import type { FC } from 'react';

export const ListSignees: FC = () => {
  const { id: tokenId } = useParams();
  const { proofOfUs, isInitiator, removeSignee } = useProofOfUs();

  const { account } = useAccount();

  return (
    <section>
      <h3>Signees</h3>
      <ul>
        {proofOfUs?.signees?.map((signee) => (
          <li key={signee.cid}>
            {signee.name}

            {isInitiator() && account?.cid !== signee.cid ? (
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
