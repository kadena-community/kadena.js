import { Button } from '@/components/Button/Button';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { useAvatar } from '@/hooks/avatar';
import { useSignToken } from '@/hooks/data/signToken';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSubmit } from '@/hooks/submit';
import { getReturnHostUrl } from '@/utils/getReturnUrl';
import { isAlreadySigning, isSignedOnce } from '@/utils/isAlreadySigning';
import { MonoArrowBack, MonoArrowDownward } from '@kadena/react-icons';
import { CopyButton, TextField } from '@kadena/react-ui';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { IconButton } from '../IconButton/IconButton';
import { ImagePositions } from '../ImagePositions/ImagePositions';
import { TitleHeader } from '../TitleHeader/TitleHeader';
import { qrClass } from './style.css';

interface IProps {
  next: () => void;
  prev: () => void;
  status: number;
}

export const MintView: FC<IProps> = ({ prev, status }) => {
  const { proofOfUs, updateStatus } = useProofOfUs();
  const router = useRouter();
  const { id } = useParams();
  const { doSubmit, isStatusLoading } = useSubmit();
  const { uploadBackground } = useAvatar();

  const handleMint = async () => {
    if (!proofOfUs) return;
    Promise.all([
      doSubmit(proofOfUs.tx),
      uploadBackground(proofOfUs.proofOfUsId),
    ]).then((values) => {
      console.log(values);
    });
  };

  useEffect(() => {
    if (!proofOfUs) return;
    if (!proofOfUs.tx) {
      throw new Error('no tx is found');
    }
    console.log('minting');
    handleMint();
  }, [proofOfUs?.tx]);

  if (!proofOfUs) return;

  return (
    <section>
      <>
        <TitleHeader label="Minting" />

        <ListSignees />
      </>
    </section>
  );
};
