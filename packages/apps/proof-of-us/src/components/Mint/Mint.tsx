import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import type { FC } from 'react';

interface IProps {
  proofOfUs: IProofOfUs;
}

export const Mint: FC<IProps> = ({ proofOfUs }) => {
  const { addSignee, removeSignee, getSigneeAccount, isConnected } =
    useProofOfUs();
  const { account } = useAccount();

  const handleJoin = async () => {
    addSignee({ tokenId: proofOfUs.tokenId });
  };

  const handleRemove = async () => {
    if (!account) return;
    removeSignee({
      tokenId: proofOfUs.tokenId,
      signee: getSigneeAccount(account),
    });
  };
  return (
    <>
      <section>
        {!isConnected() ? (
          <button onClick={handleJoin}>join</button>
        ) : (
          <button onClick={handleRemove}>remove</button>
        )}
      </section>
      scanned Proof Of Us with ID ({proofOfUs.tokenId})
    </>
  );
};
