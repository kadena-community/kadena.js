import { Button } from '@/components/Button/Button';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { useAvatar } from '@/hooks/avatar';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { useSubmit } from '@/hooks/submit';
import {
  MonoAccessTimeFilled,
  MonoChecklist,
  MonoClose,
} from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { MessageBlock } from '../MessageBlock/MessageBlock';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';
import { TitleHeader } from '../TitleHeader/TitleHeader';
import { Heading } from '../Typography/Heading';

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

  const handleGoToProof = async () => {
    alert('we need to implement this');
  };

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
            <Stack justifyContent="center" paddingBlock="xxxl">
              <MonoAccessTimeFilled fontSize="8rem" />
            </Stack>
            <ListSignees />
            <Stack flex={1} />
          </>
        )}
        {status === 'error' && (
          <>
            <Stack justifyContent="center" paddingBlock="xxxl">
              <MonoClose fontSize="8rem" />
            </Stack>

            <Stack flex={1} />
            <Stack flexDirection="column" gap="md">
              <Heading as="h6">Transaction Failed</Heading>
              <MessageBlock variant="error">
                {JSON.stringify(result, null, 2)}
              </MessageBlock>
              <Stack gap="md">
                <Button variant="secondary" onPress={handleClose}>
                  Dashboard
                </Button>
                <Button variant="tertiary" onPress={handleMint}>
                  Retry
                </Button>
              </Stack>
            </Stack>
          </>
        )}

        {status === 'success' && (
          <>
            <Stack justifyContent="center" paddingBlock="xxxl">
              <MonoChecklist fontSize="8rem" />
            </Stack>
            <ListSignees />
            <Stack flex={1} />
            <Stack flexDirection="column" gap="md">
              <Heading as="h6">Transaction Success</Heading>
              <MessageBlock variant="success">
                {JSON.stringify(result, null, 2)}
              </MessageBlock>
              <Stack gap="md">
                <Button variant="secondary" onPress={handleClose}>
                  Dashboard
                </Button>
                <Button variant="primary" onPress={handleGoToProof}>
                  Proof Details
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </>
    </ScreenHeight>
  );
};
