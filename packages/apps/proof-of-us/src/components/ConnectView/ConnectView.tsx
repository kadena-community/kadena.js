import { ImagePositions } from '@/components/ImagePositions/ImagePositions';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { useSignToken } from '@/hooks/data/signToken';
import { isSignedOnce } from '@/utils/isAlreadySigning';
import { MonoSignature } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC } from 'react';
import { Button } from '../Button/Button';
import { ListSignees } from '../ListSignees/ListSignees';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';

interface IProps {
  proofOfUs: IProofOfUsData;
  background: IProofOfUsBackground;
}

export const ConnectView: FC<IProps> = ({ proofOfUs }) => {
  const { signToken } = useSignToken();

  const handleJoin = async () => {
    signToken();
  };

  if (!proofOfUs) return null;

  return (
    <ScreenHeight>
      <TitleHeader label={proofOfUs.title ?? ''} />
      <ImagePositions />
      <ListSignees />
      <Stack flex={1} />
      {!isSignedOnce(proofOfUs.signees) ? (
        <Button onPress={handleJoin}>
          Sign <MonoSignature />
        </Button>
      ) : (
        <Stack gap="md">
          <Link href="/user">
            <Button variant="secondary">Dashboard</Button>
          </Link>

          {proofOfUs.tokenId && (
            <Link
              href={`/user/proof-of-us/t/${proofOfUs.tokenId}/${proofOfUs.requestKey}`}
            >
              <Button>Go to Proof</Button>
            </Link>
          )}
        </Stack>
      )}
    </ScreenHeight>
  );
};
