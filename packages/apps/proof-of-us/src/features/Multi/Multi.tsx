import { ImagePositions } from '@/components/ImagePositions/ImagePositions';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { SocialsEditor } from '@/components/SocialsEditor/SocialsEditor';
import { useSignToken } from '@/hooks/data/signToken';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import type { FC } from 'react';

interface IProps {
  proofOfUs: IProofOfUsData;
  background: IProofOfUsBackground;
}

export const Multi: FC<IProps> = ({ proofOfUs }) => {
  const { signToken, isLoading, hasError } = useSignToken();

  const handleJoin = async () => {
    await signToken();
  };

  if (!proofOfUs) return null;

  return (
    <>
      <section>
        <h3>{proofOfUs.title}</h3>
        <SocialsEditor />
        <ImagePositions />
        <div>status: {proofOfUs?.mintStatus}</div>
        <ListSignees />
        {!isAlreadySigning(proofOfUs.signees) && (
          <button onClick={handleJoin}>Sign</button>
        )}

        {isLoading && <div>is signing</div>}
        {hasError && <div>has error signing</div>}
      </section>
    </>
  );
};
