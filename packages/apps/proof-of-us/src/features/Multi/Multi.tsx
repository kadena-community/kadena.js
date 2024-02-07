import { ListSignees } from '@/components/ListSignees/ListSignees';
import { useSignToken } from '@/hooks/data/signToken';
import { useProofOfUs } from '@/hooks/proofOfUs';
import type { FC } from 'react';

interface IProps {
  proofOfUs: IProofOfUsData;
  background: IProofOfUsBackground;
}

export const Multi: FC<IProps> = ({ proofOfUs, background }) => {
  const { isConnected } = useProofOfUs();
  const { signToken, isLoading, hasError } = useSignToken();

  const handleJoin = async () => {
    signToken();
  };

  if (!proofOfUs) return null;

  return (
    <>
      <section>
        <img src={background} />
        <div>status: {proofOfUs?.mintStatus}</div>
        <ListSignees />
        {!isConnected() && <button onClick={handleJoin}>Sign</button>}

        {isLoading && <div>is signing</div>}
        {hasError && <div>has error signing</div>}
      </section>
    </>
  );
};
