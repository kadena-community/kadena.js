import { getAllowedSigners, isReadyToSign } from '@/utils/isAlreadySigning';
import { MonoSignature, MonoSignatureNotAllowed } from '@kadena/react-icons';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '../Button/Button';

interface IProps extends PropsWithChildren {
  signees: IProofOfUsSignee[];
  onPress: () => Promise<void>;
}

export const StartSigningButton: FC<IProps> = ({ signees, onPress }) => {
  const isReadyForSigning = isReadyToSign(signees);

  return (
    <Button isDisabled={!isReadyForSigning} onPress={onPress}>
      {isReadyForSigning ? (
        <>
          Start signing <MonoSignature />
        </>
      ) : (
        <>
          Need more signers <MonoSignatureNotAllowed />
        </>
      )}
    </Button>
  );
};
