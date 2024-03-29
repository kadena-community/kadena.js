import { ImagePositions } from '@/components/ImagePositions/ImagePositions';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { useAccount } from '@/hooks/account';
import { useSignToken } from '@/hooks/data/signToken';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { getReturnHostUrl } from '@/utils/getReturnUrl';
import { getAccountSignee, isAlreadySigning } from '@/utils/isAlreadySigning';
import { MonoSignature } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';
import { Button } from '../Button/Button';
import { ListSignees } from '../ListSignees/ListSignees';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';

interface IProps {
  params: {
    id: string;
  };
}

export const ConnectView: FC<IProps> = () => {
  const { signToken } = useSignToken();
  const { account } = useAccount();
  const { proofOfUs, addSignee, removeSignee, hasSigned } = useProofOfUs();
  const router = useRouter();

  useEffect(() => {
    if (!proofOfUs?.proofOfUsId) return;
    addSignee();
  }, [proofOfUs?.proofOfUsId]);

  const handleJoin = async () => {
    signToken();
  };

  const handleSignOff = async () => {
    const signee = getAccountSignee(proofOfUs, account);
    if (signee && proofOfUs) {
      removeSignee({ proofOfUsId: proofOfUs.proofOfUsId, signee });
    }

    router.replace('/user');
  };

  useEffect(() => {
    if (!proofOfUs) return;

    if (proofOfUs.tokenId && proofOfUs.requestKey && hasSigned()) {
      router.replace(
        `${getReturnHostUrl()}/user/proof-of-us/t/${proofOfUs.tokenId}/${
          proofOfUs.requestKey
        }`,
      );
    }
  }, [proofOfUs?.tokenId, proofOfUs?.requestKey]);

  if (!proofOfUs) return null;

  return (
    <ScreenHeight>
      <TitleHeader label={proofOfUs.title ?? ''} />
      <ImagePositions />
      <ListSignees />
      <Stack flex={1} />
      {isAlreadySigning(proofOfUs) && !hasSigned() ? (
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
            <Button onPress={handleSignOff}>Sign Off</Button>
          )}
        </Stack>
      )}
    </ScreenHeight>
  );
};
