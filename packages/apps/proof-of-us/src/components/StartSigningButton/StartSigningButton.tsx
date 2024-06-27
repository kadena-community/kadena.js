import { isReadyToSign } from '@/utils/isAlreadySigning';
import {
  MonoLoading,
  MonoSignature,
  MonoSignatureNotAllowed,
} from '@kadena/react-icons';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '../Button/Button';
import { animateClass } from '../SignStatus/style.css';

interface IProps extends PropsWithChildren {
  isLoading: boolean;
  signees?: IProofOfUsSignee[];
  onPress: () => Promise<void>;
}

export const StartSigningButton: FC<IProps> = ({
  isLoading,
  signees,
  onPress,
}) => {
  const isReadyForSigning = isReadyToSign(signees);

  if (!signees?.length) return;
  return (
    <Button isDisabled={!isReadyForSigning} onPress={onPress}>
      {isReadyForSigning ? (
        isLoading ? (
          <>
            Uploading image <MonoLoading className={animateClass} />
          </>
        ) : (
          <>
            Start signing <MonoSignature />
          </>
        )
      ) : (
        <>
          Need more signers <MonoSignatureNotAllowed />
        </>
      )}
    </Button>
  );
};
