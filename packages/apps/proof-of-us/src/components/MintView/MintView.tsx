import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSubmit } from '@/hooks/submit';
import { getReturnHostUrl } from '@/utils/getReturnUrl';
import { haveAllSigned } from '@/utils/isAlreadySigning';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';

interface IProps {
  next: () => void;
  prev: () => void;
  status: number;
}

export const MintView: FC<IProps> = () => {
  const { proofOfUs, updateSigner, updateProofOfUs } = useProofOfUs();
  const { doSubmit } = useSubmit();
  const { uploadBackground } = useAvatar();
  const router = useRouter();

  const handleMint = async () => {
    if (!proofOfUs) return;

    try {
      await uploadBackground(proofOfUs.proofOfUsId);
    } catch (e) {
      console.error('UPLOAD ERR');
    }
    try {
      const signees = updateSigner({ signerStatus: 'success' }, true);

      console.log('update in mintview');
      await updateProofOfUs({
        status: haveAllSigned(signees) ? 4 : 3,
        signees: signees,
      });

      await doSubmit(proofOfUs.tx);
      router.replace(
        `${getReturnHostUrl()}/user/proof-of-us/t/${proofOfUs.tokenId}/${
          proofOfUs.requestKey
        }`,
      );
    } catch (e) {
      console.error('SUBMIT ERR');
    }
  };

  useEffect(() => {
    if (!proofOfUs) return;

    if (!proofOfUs.tx) {
      throw new Error('no tx is found');
    }
    handleMint();
  }, [proofOfUs?.tx]);

  if (!proofOfUs) return;

  return <ScreenHeight></ScreenHeight>;
};
