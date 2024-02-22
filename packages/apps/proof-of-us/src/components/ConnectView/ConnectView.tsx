import { ImagePositions } from '@/components/ImagePositions/ImagePositions';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { SocialsEditor } from '@/components/SocialsEditor/SocialsEditor';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { useSignToken } from '@/hooks/data/signToken';
import { useSubmit } from '@/hooks/submit';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import type { FC } from 'react';

interface IProps {
  proofOfUs: IProofOfUsData;
  background: IProofOfUsBackground;
}

export const ConnectView: FC<IProps> = ({ proofOfUs }) => {
  const { signToken } = useSignToken();
  const { isStatusLoading } = useSubmit();

  const handleJoin = async () => {
    await signToken();
  };

  if (!proofOfUs) return null;

  return (
    <>
      {isStatusLoading && <MainLoader />}
      <section>
        <TitleHeader label="Details" />

        <h3>{proofOfUs.title}</h3>
        <SocialsEditor />
        <ImagePositions />

        <div>status: {proofOfUs?.mintStatus}</div>
        <ListSignees />
        {!isAlreadySigning(proofOfUs.signees) && (
          <button onClick={handleJoin}>Sign</button>
        )}
      </section>
    </>
  );
};
