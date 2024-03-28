import { ImagePositions } from '@/components/ImagePositions/ImagePositions';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { useAccount } from '@/hooks/account';
import { useSignToken } from '@/hooks/data/signToken';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import { getReturnHostUrl } from '@/utils/getReturnUrl';
import { getAccountSignee, isAlreadySigning } from '@/utils/isAlreadySigning';
import { MonoSignature } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { ListSignees } from '../ListSignees/ListSignees';
import { Modal } from '../Modal/Modal';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';
import { Text } from '../Typography/Text';

interface IProps {
  params: {
    id: string;
  };
}

export const ConnectView: FC<IProps> = () => {
  const { signToken } = useSignToken();
  const { account } = useAccount();
  const [signed, setSigned] = useState(false);
  const [showMaxModal, setShowMaxModal] = useState(false);
  const { proofOfUs, signees, addSignee, removeSignee, hasSigned, isSignee } =
    useProofOfUs();
  const router = useRouter();

  const check2AddSignee = async () => {
    if (!proofOfUs?.proofOfUsId || !signees) return;
    const isSigneeResult = await isSignee();
    console.log(22, isSigneeResult, signees.length);
    if (signees.length >= env.MAXSIGNERS && !isSigneeResult) {
      setShowMaxModal(true);
      return;
    }

    addSignee();
  };

  useEffect(() => {
    check2AddSignee();
  }, [proofOfUs?.proofOfUsId, signees?.length]);

  const handleJoin = async () => {
    signToken();
  };

  const handleSignOff = async () => {
    const signee = getAccountSignee(signees, account);
    if (signee && proofOfUs) {
      removeSignee({ proofOfUsId: proofOfUs.proofOfUsId, signee });
    }

    router.replace('/user');
  };

  const initSigned = useCallback(
    async (proofOfUs?: IProofOfUsData) => {
      if (!proofOfUs) return;
      const innerSigned = await hasSigned();
      setSigned(innerSigned);
      if (proofOfUs.tokenId && proofOfUs.requestKey && innerSigned) {
        router.replace(
          `${getReturnHostUrl()}/user/proof-of-us/t/${proofOfUs.tokenId}/${
            proofOfUs.requestKey
          }`,
        );
      }
    },
    [setSigned],
  );

  useEffect(() => {
    initSigned(proofOfUs);
  }, [proofOfUs?.tokenId, proofOfUs?.requestKey, signees]);

  if (!proofOfUs) return null;

  if (showMaxModal) {
    return (
      <Modal label="Maximum signees" onClose={() => {}}>
        <Stack flexDirection="column" gap="md">
          <Text>There are already a max of {env.MAXSIGNERS} signed in.</Text>

          <Link href="/user">
            <Button>Close</Button>
          </Link>
        </Stack>
      </Modal>
    );
  }
  return (
    <ScreenHeight>
      <TitleHeader label={proofOfUs.title ?? ''} />
      <ImagePositions />
      <ListSignees />
      <Stack flex={1} />
      {isAlreadySigning(proofOfUs) && !signed ? (
        <Stack gap="md">
          <Button onPress={handleJoin}>
            Sign <MonoSignature />
          </Button>
        </Stack>
      ) : (
        <Stack gap="md">
          <Button onPress={handleSignOff} variant="secondary">
            Dashboard
          </Button>

          {proofOfUs.tokenId ? (
            <Link
              href={`/user/proof-of-us/t/${proofOfUs.tokenId}/${proofOfUs.requestKey}`}
            >
              <Button>Go to Proof</Button>
            </Link>
          ) : (
            <Button onPress={handleSignOff}>Drop out!</Button>
          )}
        </Stack>
      )}
    </ScreenHeight>
  );
};
