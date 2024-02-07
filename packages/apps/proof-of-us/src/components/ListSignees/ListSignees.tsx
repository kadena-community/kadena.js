import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';

import type { FC } from 'react';
import { SignStatus } from '../SignStatus/SignStatus';
import { wrapperClass } from './style.css';

//TODO:
//ATM we check the signing status of both users via a websocket.
//it would be better to directly check the chain for who signed.
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
        <SignStatus status={initiator?.signerStatus} />
        {initiator?.displayName} {isMe(initiator, account) && ' (me)'}
      </div>
      <div>
        <h4>Signer</h4>
        <SignStatus status={signee?.signerStatus} />

        {signee && (
          <>
            {signee?.displayName} {isMe(signee, account) && ' (me)'}
          </>
        )}
      </div>
    </section>
  );
};
