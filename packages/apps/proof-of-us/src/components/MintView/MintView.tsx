import { Button } from '@/components/Button/Button';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSubmit } from '@/hooks/submit';
import { MonoClose } from '@kadena/react-icons';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { MainLoader } from '../MainLoader/MainLoader';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';
import { TitleHeader } from '../TitleHeader/TitleHeader';

interface IProps {
  next: () => void;
  prev: () => void;
  status: number;
}

export const MintView: FC<IProps> = ({ prev }) => {
  const { proofOfUs } = useProofOfUs();
  const { doSubmit, isStatusLoading, status, result } = useSubmit();
  const { uploadBackground } = useAvatar();
  const router = useRouter();

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
      //throw new Error('no tx is found');
    }
    //handleMint();
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

        <div>isloading: {isStatusLoading.toString()}</div>

        {isStatusLoading && <MainLoader />}
        {status === 'error' && (
          <div>
            <pre>{JSON.stringify(result, null, 2)}</pre>
            <Button onPress={handleMint}>Retry</Button>
          </div>
        )}

        {status === 'success' && <div>Hurray!!!</div>}

        <ListSignees />
      </>
    </ScreenHeight>
  );
};
