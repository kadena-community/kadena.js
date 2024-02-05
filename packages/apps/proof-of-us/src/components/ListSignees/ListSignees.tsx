import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';

import type { FC } from 'react';
import { wrapperClass } from './style.css';

export const ListSignees: FC = () => {
  const { proofOfUs } = useProofOfUs();

  const { account } = useAccount();

  const initiator = proofOfUs?.signees?.find((s) => s.initiator);
  const signee = proofOfUs?.signees?.find((s) => !s.initiator);

  const isMe = (signer?: IProofOfUsSignee, account?: IAccount) => {
    if (!signer || !account) return false;
    return signer.cid === account?.cid;
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
            {signee?.displayName} {isMe(signee, account) && ' (me)'}
          </>
        )}
      </div>
    </section>
  );
};
