import { ListSignees } from '@/components/ListSignees/ListSignees';
import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSubmit } from '@/hooks/submit';
import { MonoClose } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';
import { ErrorStatus } from '../Status/ErrorStatus';
import { LoadingStatus } from '../Status/LoadingStatus';
import { SuccessStatus } from '../Status/SuccessStatus';
import { TitleHeader } from '../TitleHeader/TitleHeader';

interface IProps {
  next: () => void;
  prev: () => void;
  status: number;
}

export const MintView: FC<IProps> = () => {
  const { proofOfUs } = useProofOfUs();
  const { doSubmit, isStatusLoading, status, result } = useSubmit();
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
      await doSubmit(proofOfUs.tx);
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

  const handleClose = () => {
    router.push('/user');
  };

  if (!proofOfUs) return;

  return (
    <ScreenHeight>
      <>
        <TitleHeader
          label={proofOfUs.title ?? ''}
          Append={() => (
            <IconButton onClick={handleClose}>
              <MonoClose />
            </IconButton>
          )}
        />

        {isStatusLoading && (
          <>
            <LoadingStatus />
            <ListSignees />
            <Stack flex={1} />
          </>
        )}
        {status === 'error' && (
          <ErrorStatus handleClose={handleClose} handleMint={handleMint}>
            {JSON.stringify(result, null, 2)}
          </ErrorStatus>
        )}

        {status === 'success' && (
          <SuccessStatus
            handleClose={handleClose}
            href={`/user/proof-of-us/t/${proofOfUs.tokenId}/${proofOfUs.requestKey}`}
          >
            View the created Proof or create a new one.
          </SuccessStatus>
        )}
      </>
    </ScreenHeight>
  );
};
