import { ImagePositions } from '@/components/ImagePositions/ImagePositions';
import { MainLoader } from '@/components/MainLoader/MainLoader';
import { TitleHeader } from '@/components/TitleHeader/TitleHeader';
import { useSignToken } from '@/hooks/data/signToken';
import { useSubmit } from '@/hooks/submit';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
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
  const { isStatusLoading } = useSubmit();

  const handleJoin = async () => {
    //TODO FIX for the isAlreadySigning changes to quick
    setTimeout(() => {
      signToken();
    }, 500);
  };

  if (!proofOfUs) return null;

  return (
    <ScreenHeight>
      {isStatusLoading && <MainLoader />}

      <TitleHeader label={proofOfUs.title ?? ''} />
      <ImagePositions />
      <ListSignees />
      <Stack flex={1} />
      {!isAlreadySigning(proofOfUs.signees) ? (
        <Button onPress={handleJoin}>
          Sign <MonoSignature />
        </Button>
      ) : (
        <Stack gap="md">
          <Button variant="secondary">
            <Link href="/user">Dashboard</Link>
          </Button>

          {proofOfUs.tokenId && (
            <Button>
              <Link
                href={`/user/proof-of-us/t/${proofOfUs.tokenId}/${proofOfUs.requestKey}`}
              >
                Go to Proof
              </Link>
            </Button>
          )}
        </Stack>
      )}
    </ScreenHeight>
  );
};
