import { Confirmation } from '@/components/Confirmation/Confirmation';
import { showModalBtnWrapperClass } from '@/components/ConnectView/styles.css';
import { ImagePositions } from '@/components/ImagePositions/ImagePositions';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { useAccount } from '@/hooks/account';
import { useSignToken } from '@/hooks/data/signToken';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import { getReturnHostUrl, getReturnUrl } from '@/utils/getReturnUrl';
import { getAccountSignee, isAlreadySigning } from '@/utils/isAlreadySigning';
import { MonoSignature } from '@kadena/kode-icons';
import { Stack } from '@kadena/kode-ui';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const params = useSearchParams();
  const shouldAddParam = params.get('shouldAdd');

  const { account, isMounted } = useAccount();
  const [signed, setSigned] = useState(false);
  const [showMaxModal, setShowMaxModal] = useState(false);
  const { proofOfUs, signees, addSignee, removeSignee, hasSigned, isSignee } =
    useProofOfUs();
  const router = useRouter();

  const check2AddSignee = async () => {
    if (!proofOfUs?.proofOfUsId || !signees) return;
    const isSigneeResult = await isSignee();

    if (
      (signees.length >= env.MAXSIGNERS && !isSigneeResult) ||
      isAlreadySigning(proofOfUs)
    ) {
      setShowMaxModal(true);
      return;
    }

    await addSignee();
    router.replace(getReturnUrl());
  };

  const checkIfSignee = async () => {
    if (!proofOfUs?.proofOfUsId || !signees) return;
    const isSigneeResult = await isSignee();
    if (isSigneeResult) return;

    router.replace('/');
  };

  useEffect(() => {
    if (!isMounted || !signees?.length) return;

    if (!shouldAddParam) {
      checkIfSignee();
      return;
    }
    check2AddSignee();
  }, [proofOfUs?.proofOfUsId, signees, shouldAddParam, isMounted]);

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

  const signee = useMemo(() => {
    return getAccountSignee(signees, account);
  }, [signees, account]);

  const initSigned = useCallback(
    async (proofOfUs?: IProofOfUsData) => {
      if (!proofOfUs) return;
      const innerSigned = await hasSigned();
      setSigned(innerSigned);

      if (proofOfUs.tokenId && proofOfUs.requestKey && innerSigned) {
        router.replace(
          `${getReturnHostUrl()}/user/proof-of-us/mint/${
            proofOfUs.requestKey
          }?id=${proofOfUs.proofOfUsId}`,
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
      <Modal label="No more signees allowed" onClose={() => {}}>
        <Stack flexDirection="column" gap="md">
          <Text>
            There are already a max of {env.MAXSIGNERS} signed in.
            <br />
            Or we are already signing the NFT{' '}
          </Text>

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
      {isAlreadySigning(proofOfUs) &&
      !signed &&
      signee?.signerStatus !== 'notsigning' ? (
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

          {proofOfUs.tokenId ? null : (
            <Confirmation
              text="Are you sure you want to be removed from the list?"
              action={handleSignOff}
              showModalBtnWrapperClass={showModalBtnWrapperClass}
            >
              <Button>Drop out!</Button>
            </Confirmation>
          )}
        </Stack>
      )}
    </ScreenHeight>
  );
};
