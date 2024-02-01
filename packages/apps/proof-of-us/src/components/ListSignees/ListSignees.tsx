import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useParams } from 'next/navigation';
import type { FC } from 'react';
import { wrapperClass } from './style.css';

export const ListSignees: FC = () => {
  const { id: proofOfUsId } = useParams();
  const { proofOfUs, isInitiator, removeSignee } = useProofOfUs();

  const { account } = useAccount();

  const initiator = proofOfUs?.signees?.find((s) => s.initiator);
  const signee = proofOfUs?.signees?.find((s) => !s.initiator);

  const isMe = (signer?: IProofOfUsSignee, account?: IAccount) => {
    if (!signer || !account) return false;
    return signer.cid === account?.cid;
  };

  const handleRemove = () => {
    if (!signee) return;
    removeSignee({ proofOfUsId: proofOfUsId.toString(), signee });
  };

  return (
    <section className={wrapperClass}>
      <div>
        <h4>Initiator</h4>
        {initiator?.displayName} {isMe(initiator, account) && ' (me)'}
      </div>
      <div>
        <h4>Signer</h4>
        {signee && (
          <>
            {signee?.displayName}
            {isMe(signee, account) || isInitiator() ? (
              <button onClick={handleRemove}>remove</button>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
};
