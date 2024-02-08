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
    await signToken();
  };

  if (!proofOfUs) return null;

  return (
    <>
      <section>
        <h3>{proofOfUs.title}</h3>
        <img src={background} alt="our image" />
        <div>status: {proofOfUs?.mintStatus}</div>
        <ListSignees />
        {!isConnected() && <button onClick={handleJoin}>Sign</button>}

        {isLoading && <div>is signing</div>}
        {hasError && <div>has error signing</div>}
      </section>
    </>
  );
};
