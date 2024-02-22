import { ImagePositions } from '@/components/ImagePositions/ImagePositions';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { useSignToken } from '@/hooks/data/signToken';
import { useSubmit } from '@/hooks/submit';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import { MonoSignature } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import { Button } from '../Button/Button';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';
import { TextField } from '../TextField/TextField';

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
    <ScreenHeight>
      {isStatusLoading && <MainLoader />}

      <TitleHeader label="Details" />

      <ImagePositions />

      <div>status: {proofOfUs?.mintStatus}</div>

      <TextField
        name="title"
        placeholder="Title"
        disabled
        defaultValue={proofOfUs.title}
      />
      <Stack flex={1} />
      {!isAlreadySigning(proofOfUs.signees) && (
        <Button onPress={handleJoin}>
          Sign <MonoSignature />
        </Button>
      )}
    </ScreenHeight>
  );
};
