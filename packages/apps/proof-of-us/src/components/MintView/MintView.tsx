import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSubmit } from '@/hooks/submit';
import type { FC } from 'react';
import { useEffect } from 'react';
import { ListSignees } from '../ListSignees/ListSignees';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';
import { LoadingStatus } from '../Status/LoadingStatus';

interface IProps {
  next: () => void;
  prev: () => void;
  status: number;
}

export const MintView: FC<IProps> = () => {
  const { proofOfUs, signees, updateSignee } = useProofOfUs();
  const { doSubmit, transaction } = useSubmit();
  const { uploadBackground } = useAvatar();

  const handleMint = async () => {
    if (!proofOfUs) return;

    try {
      await uploadBackground(proofOfUs.proofOfUsId);
    } catch (e) {
      console.error('UPLOAD ERR');
    }
    try {
      await updateSignee({ signerStatus: 'success' }, true);
      await doSubmit();
    } catch (e) {
      console.error('SUBMIT ERR');
    }
  };

  useEffect(() => {
    if (!proofOfUs || !signees || !transaction) return;

    if (!proofOfUs.tx) {
      throw new Error('no tx is found');
    }
    handleMint();
  }, [proofOfUs?.tx, signees?.length, transaction]);

  if (!proofOfUs) return;

  return (
    <ScreenHeight>
      <LoadingStatus />
      <ListSignees />
    </ScreenHeight>
  );
};
