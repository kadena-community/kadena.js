import { AvatarEditor } from '@/components/AvatarEditor/AvatarEditor';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { useAccount } from '@/hooks/account';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSignToken } from '@/hooks/signToken';
import type { FC } from 'react';

interface IProps {
  proofOfUs: IProofOfUs;
}

export const Multi: FC<IProps> = ({ proofOfUs }) => {
  const { addSignee, isConnected } = useProofOfUs();
  const { signToken, isLoading, hasError } = useSignToken();
  const { account } = useAccount();

  const handleJoin = async () => {
    signToken(account);
  };

  if (!proofOfUs) return null;

  return (
    <>
      <section>
        <img src={proofOfUs.avatar.background} />
        <div>status: {proofOfUs?.mintStatus}</div>
        <ListSignees />
        {!isConnected() && <button onClick={handleJoin}>Sign</button>}
      </section>
    </>
  );
};
